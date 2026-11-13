"""
Prepare a project's photos for the website.

For each photo listed in the config it:
  1. applies the EXIF rotation, then an optional crop (e.g. to remove an Instagram frame),
  2. writes WebP copies at several widths (never upscaling), with all metadata stripped,
  3. records the size and a tiny blurred placeholder in a manifest the site reads.

Usage:
    python3 scripts/process_project_images.py scripts/projects/<slug>.json

Config format (see scripts/projects/tanta-shubar.json):
    {
      "slug": "tanta-shubar",
      "source_dir": "/path/to/originals",
      "images": [
        {"id": "entrance", "file": "IMG_1.jpg", "crop": [left, top, right, bottom]},
        {"id": "hero", "file": "room.jpg", "blur": 3, "brightness": 0.55, "saturation": 0.85},
        ...
      ]
    }

Output (defaults; override with "public_dir" and "manifest" in the config):
    public/work/<slug>/<id>-<width>.webp
    src/data/projects/<slug>.images.json
Requires Pillow (pip install pillow).
"""

import base64
import io
import json
import os
import sys

from PIL import Image, ImageEnhance, ImageFilter, ImageOps

WIDTHS = [640, 1080, 1600, 2400]
QUALITY = 82
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def variants_for(width: int) -> list[int]:
    ws = [w for w in WIDTHS if w < width]
    ws.append(min(width, WIDTHS[-1]))
    return sorted(set(ws))


def blur_placeholder(im: Image.Image) -> str:
    small = im.copy()
    small.thumbnail((16, 16))
    buf = io.BytesIO()
    small.convert("RGB").save(buf, "JPEG", quality=55)
    return "data:image/jpeg;base64," + base64.b64encode(buf.getvalue()).decode()


def main(config_path: str) -> None:
    with open(config_path, encoding="utf-8") as fh:
        cfg = json.load(fh)
    slug = cfg["slug"]
    # Optional overrides, e.g. for site images that are not portfolio projects.
    public_dir = cfg.get("public_dir", f"work/{slug}")
    manifest_path = cfg.get("manifest", f"projects/{slug}.images.json")
    out_dir = os.path.join(ROOT, "public", *public_dir.split("/"))
    os.makedirs(out_dir, exist_ok=True)

    manifest = {}
    for item in cfg["images"]:
        source_dir = cfg["source_dir"]
        if not os.path.isabs(source_dir):  # relative paths are relative to the project root
            source_dir = os.path.join(ROOT, source_dir)
        src = os.path.join(source_dir, item["file"])
        im = ImageOps.exif_transpose(Image.open(src)).convert("RGB")
        if item.get("crop"):
            im = im.crop(tuple(item["crop"]))
        # Optional "baked" look, so the browser does not have to filter a large image live.
        # blur is in CSS pixels at a 1440px-wide display, scaled to this image's width.
        if item.get("blur"):
            im = im.filter(ImageFilter.GaussianBlur(item["blur"] * im.width / 1440))
        if item.get("brightness") is not None:
            im = ImageEnhance.Brightness(im).enhance(item["brightness"])
        if item.get("saturation") is not None:
            im = ImageEnhance.Color(im).enhance(item["saturation"])
        widths = variants_for(im.width)
        for w in widths:
            h = round(im.height * w / im.width)
            resized = im if w == im.width else im.resize((w, h), Image.LANCZOS)
            # Pillow writes no EXIF/GPS unless asked, so the copies carry no metadata.
            resized.save(os.path.join(out_dir, f"{item['id']}-{w}.webp"), "WEBP", quality=item.get("quality", QUALITY), method=6)
        # Link previews (WhatsApp, Facebook) handle JPEG most reliably: write one for covers.
        if item.get("og") or item["id"] == "cover":
            ow = min(1200, im.width)
            im.resize((ow, round(im.height * ow / im.width)), Image.LANCZOS).save(
                os.path.join(out_dir, f"{item['id']}-og.jpg"), "JPEG", quality=85, optimize=True, progressive=True
            )
        top = widths[-1]
        manifest[item["id"]] = {
            "src": f"/{public_dir}/{item['id']}",
            "widths": widths,
            "width": top,
            "height": round(im.height * top / im.width),
            "blur": blur_placeholder(im),
        }
        print(f"{item['id']:14} {im.width}x{im.height} -> {widths}")

    target = os.path.join(ROOT, "src", "data", *manifest_path.split("/"))
    os.makedirs(os.path.dirname(target), exist_ok=True)
    with open(target, "w", encoding="utf-8") as fh:
        json.dump(manifest, fh, indent=2)
        fh.write("\n")


if __name__ == "__main__":
    main(sys.argv[1])
