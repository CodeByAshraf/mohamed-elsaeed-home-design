#!/usr/bin/env python3
"""
Extract each project's colour palette from its own photographs.

    python3 scripts/extract_palette.py            # every project in src/data/projects
    python3 scripts/extract_palette.py tanta-cafe # one project

For every project it reads the smallest WebP of each photo (public/work/<slug>/<id>-<width>.webp),
clusters all their pixels (k-means in a perceptual colour space), keeps six clearly different colours
and writes them, lightest first, with the share of the photographs each one covers, to
src/data/projects/<slug>.palette.json. The site shows them on the project page and the homepage.
Needs Python 3 with Pillow.
"""
import json
import math
import random
import sys
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / "src" / "data" / "projects"
PUBLIC = ROOT / "public"
SWATCHES = 6
CLUSTERS = 14
SAMPLE_PER_PHOTO = 2500


def srgb_to_lab(rgb):
    def lin(c):
        c /= 255
        return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4

    r, g, b = (lin(float(c)) for c in rgb)
    x = (0.4124 * r + 0.3576 * g + 0.1805 * b) / 0.95047
    y = 0.2126 * r + 0.7152 * g + 0.0722 * b
    z = (0.0193 * r + 0.1192 * g + 0.9505 * b) / 1.08883

    def f(t):
        return t ** (1 / 3) if t > 0.008856 else 7.787 * t + 16 / 116

    fx, fy, fz = f(x), f(y), f(z)
    return (116 * fy - 16, 500 * (fx - fy), 200 * (fy - fz))


def dist(a, b):
    return math.sqrt(sum((p - q) ** 2 for p, q in zip(a, b)))


def kmeans(points, k, rounds=18, seed=7):
    rng = random.Random(seed)
    # k-means++ start
    centres = [rng.choice(points)]
    while len(centres) < k:
        d2 = [min(dist(p, c) ** 2 for c in centres) for p in points]
        total = sum(d2)
        pick, acc = rng.random() * total, 0.0
        for p, w in zip(points, d2):
            acc += w
            if acc >= pick:
                centres.append(p)
                break
    for _ in range(rounds):
        groups = [[] for _ in centres]
        for p in points:
            i = min(range(len(centres)), key=lambda j: dist(p, centres[j]))
            groups[i].append(p)
        centres = [
            tuple(sum(v[n] for v in g) / len(g) for n in range(len(g[0]))) if g else centres[i]
            for i, g in enumerate(groups)
        ]
    return centres, [len(g) for g in groups]


def palette_for(slug):
    manifest = json.loads((DATA / f"{slug}.images.json").read_text())
    rng = random.Random(slug)
    samples = []  # (lab, rgb)
    for asset in manifest.values():
        path = PUBLIC / f"{asset['src'].lstrip('/')}-{min(asset['widths'])}.webp"
        img = Image.open(path).convert("RGB")
        img.thumbnail((160, 160))
        pixels = list(img.get_flattened_data()) if hasattr(img, "get_flattened_data") else list(img.getdata())
        for rgb in rng.sample(pixels, min(SAMPLE_PER_PHOTO, len(pixels))):
            samples.append((srgb_to_lab(rgb), rgb))

    labs = [s[0] for s in samples]
    pool = rng.sample(labs, min(6000, len(labs)))
    centres, counts = kmeans(pool, CLUSTERS)

    # Average the real sRGB pixels nearest each centre (exact, displayable colours).
    sums = [[0, 0, 0, 0] for _ in centres]
    for lab, rgb in samples:
        i = min(range(len(centres)), key=lambda j: dist(lab, centres[j]))
        s = sums[i]
        s[0] += rgb[0]; s[1] += rgb[1]; s[2] += rgb[2]; s[3] += 1
    total = sum(s[3] for s in sums)
    clusters = []
    for s, c in zip(sums, centres):
        if s[3] == 0:
            continue
        rgb = tuple(round(v / s[3]) for v in s[:3])
        lab = srgb_to_lab(rgb)
        chroma = math.hypot(lab[1], lab[2])
        clusters.append({"rgb": rgb, "lab": lab, "share": s[3] / total, "chroma": chroma})

    # Keep distinct colours: biggest first, but let a strongly coloured accent (timber, brass, sage)
    # win a place over another grey of similar size.
    clusters.sort(key=lambda c: c["share"] * (1 + c["chroma"] / 25), reverse=True)
    chosen = []
    for c in clusters:
        # Cool, bluish clusters are daylight and sky through the windows, not the interior's materials.
        if c["lab"][2] < -6:
            continue
        if all(dist(c["lab"], o["lab"]) > 14 for o in chosen):
            chosen.append(c)
        if len(chosen) == SWATCHES:
            break

    chosen.sort(key=lambda c: c["lab"][0], reverse=True)
    return [
        {"hex": "#%02x%02x%02x" % c["rgb"], "share": round(c["share"] * 100)}
        for c in chosen
    ]


def main():
    slugs = sys.argv[1:] or sorted(p.name.removesuffix(".images.json") for p in DATA.glob("*.images.json"))
    for slug in slugs:
        palette = palette_for(slug)
        out = DATA / f"{slug}.palette.json"
        out.write_text(json.dumps(palette, indent=2) + "\n")
        print(slug, " ".join(f"{p['hex']}({p['share']}%)" for p in palette))


if __name__ == "__main__":
    main()
