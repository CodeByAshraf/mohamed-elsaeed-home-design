import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, test } from "node:test";
import { imageFile, imageSrcSet } from "../../src/lib/image-srcset";

const root = process.cwd();

/** Every image asset ({ src, widths, ... }) in the generated manifests under src/data. */
function manifestAssets() {
  const assets = [];
  const walk = (value) => {
    if (Array.isArray(value)) value.forEach(walk);
    else if (value && typeof value === "object") {
      if (typeof value.src === "string" && Array.isArray(value.widths)) assets.push(value);
      else Object.values(value).forEach(walk);
    }
  };
  const dataDir = join(root, "src", "data");
  for (const entry of readdirSync(dataDir, { recursive: true })) {
    if (String(entry).endsWith(".images.json")) walk(JSON.parse(readFileSync(join(dataDir, entry), "utf8")));
  }
  return assets;
}

/** Pixel width from a WebP file's header (lossy, lossless and extended formats). */
function webpWidth(file) {
  const b = readFileSync(file);
  const chunk = b.toString("ascii", 12, 16);
  if (chunk === "VP8X") return 1 + b.readUIntLE(24, 3);
  if (chunk === "VP8 ") return b.readUInt16LE(26) & 0x3fff;
  if (chunk === "VP8L") return (b.readUInt32LE(21) & 0x3fff) + 1;
  throw new Error(`${file}: not a WebP file`);
}

const parse = (srcSet) =>
  srcSet.split(", ").map((candidate) => {
    const [url, descriptor] = candidate.split(" ");
    return { url, width: Number(descriptor.slice(0, -1)), unit: descriptor.at(-1) };
  });

describe("imageSrcSet", () => {
  test("lists each available width once, labelled with that width", () => {
    const image = { src: "/work/p/room", widths: [640, 1080, 1192] };
    assert.equal(imageFile(image, 640), "/work/p/room-640.webp");
    assert.equal(
      imageSrcSet(image),
      "/work/p/room-640.webp 640w, /work/p/room-1080.webp 1080w, /work/p/room-1192.webp 1192w",
    );
  });

  test("every descriptor in every manifest is the real pixel width of the file it names", () => {
    const assets = manifestAssets();
    assert.ok(assets.length > 40, `found only ${assets.length} image assets`);
    for (const image of assets) {
      const candidates = parse(imageSrcSet(image));
      assert.equal(new Set(candidates.map((c) => c.url)).size, candidates.length, `${image.src}: a file is listed twice`);
      for (const { url, width, unit } of candidates) {
        assert.equal(unit, "w", url);
        assert.equal(webpWidth(join(root, "public", url)), width, `${url} is not ${width}px wide`);
      }
    }
  });
});
