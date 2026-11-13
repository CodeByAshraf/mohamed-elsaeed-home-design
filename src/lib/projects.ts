/**
 * Portfolio projects. Add a new project by:
 *   1. running scripts/process_project_images.py with a config in scripts/projects/,
 *   2. running scripts/extract_palette.py <slug> for its colour palette,
 *   3. importing the generated manifest and palette below and adding an entry to `layouts`,
 *   4. adding its words (title, tagline, summary, facts, photo descriptions) to BOTH
 *      src/content/projects.en.ts and src/content/projects.ar.ts.
 * The first project in the list is featured first on the homepage.
 */
import tantaShubar from "@/data/projects/tanta-shubar.images.json";
import tantaCafe from "@/data/projects/tanta-cafe.images.json";
import tantaCorniche from "@/data/projects/tanta-corniche.images.json";
import tantaRiyadh from "@/data/projects/tanta-riyadh.images.json";
import tantaAshraf from "@/data/projects/tanta-ashraf.images.json";
import paletteShubar from "@/data/projects/tanta-shubar.palette.json";
import paletteCafe from "@/data/projects/tanta-cafe.palette.json";
import paletteCorniche from "@/data/projects/tanta-corniche.palette.json";
import paletteRiyadh from "@/data/projects/tanta-riyadh.palette.json";
import paletteAshraf from "@/data/projects/tanta-ashraf.palette.json";
import { projectText as projectTextEn } from "@/content/projects.en";
import { projectText as projectTextAr } from "@/content/projects.ar";
import type { Locale } from "@/i18n/config";

export type ImageAsset = {
  /** Path without extension or width, e.g. "/work/tanta-shubar/kitchen". */
  src: string;
  /** Widths available on disk as `${src}-${width}.webp`. */
  widths: number[];
  width: number;
  height: number;
  blur: string;
};

export type ProjectImage = ImageAsset & { alt: string };

type Span = 4 | 5 | 6 | 7;
type Start = 2 | 3 | 7 | 8;
type Align = "start" | "center" | "end";

/** One row of the editorial gallery on desktop. On phones every photo is full width. */
export type GalleryRow = {
  items: {
    image: ProjectImage;
    /** Columns out of 12 on desktop. */
    span: Span;
    /** Optional starting column on desktop, for deliberate offsets (counted from the reading start). */
    start?: Start;
    /** Vertical alignment within the row on desktop. */
    align?: Align;
  }[];
};

/** A colour taken from the project's own photographs (scripts/extract_palette.py), lightest first. */
export type Swatch = { hex: string; /** Percentage of the photographs' pixels closest to it. */ share: number };

export type FactKey = "location" | "area" | "scope" | "year" | "duration";

export type Project = {
  slug: string;
  title: string;
  seoTitle: string;
  seoDescription: string;
  tagline: string;
  summary: string;
  facts: { key: FactKey; value: string }[];
  cover: ProjectImage;
  gallery: GalleryRow[];
  palette: Swatch[];
};

/** The words of a project in one language. `alt` describes every photo, keyed by its manifest id. */
export type ProjectText = {
  title: string;
  /** Search result title (about 50 characters; the brand is added after it). */
  seoTitle: string;
  /** Search result description (about 150 characters). */
  seoDescription: string;
  tagline: string;
  summary: string;
  location: string;
  scope: string;
  duration: string;
  alt: Record<string, string>;
};

type Manifest = Record<string, ImageAsset>;
type Layout = {
  slug: string;
  images: Manifest;
  palette: Swatch[];
  /** Square metres. */
  area: number;
  year: number;
  rows: { id: string; span: Span; start?: Start; align?: Align }[][];
};

/* Photo order and desktop layout, shared by both languages. */
const layouts: Layout[] = [
  {
    slug: "tanta-shubar",
    images: tantaShubar,
    palette: paletteShubar,
    area: 120,
    year: 2026,
    rows: [
      [{ id: "entrance", span: 7 }, { id: "corridor", span: 5, align: "end" }],
      [{ id: "reception", span: 5 }, { id: "arched-wall", span: 7, align: "center" }],
      [{ id: "wall-light", span: 4, start: 2 }, { id: "kitchen", span: 6, start: 7, align: "end" }],
      [{ id: "kitchen-corner", span: 6 }, { id: "door-detail", span: 5, start: 8, align: "start" }],
      [{ id: "bedroom", span: 7 }, { id: "bathroom", span: 5, align: "end" }],
    ],
  },
  {
    slug: "tanta-cafe",
    images: tantaCafe,
    palette: paletteCafe,
    area: 100,
    year: 2024,
    rows: [
      [{ id: "cafe-floor", span: 7 }, { id: "name-wall", span: 5, align: "end" }],
      [{ id: "seating-stair", span: 5 }, { id: "dining-hall", span: 5, start: 8, align: "end" }],
      [{ id: "upper-level", span: 5, start: 2 }, { id: "window-swings", span: 4, start: 8, align: "end" }],
      [{ id: "banquette", span: 6 }, { id: "banquette-detail", span: 5, start: 8, align: "end" }],
      [{ id: "upper-wall", span: 4, start: 3 }, { id: "exterior", span: 5, start: 8, align: "center" }],
    ],
  },
  {
    slug: "tanta-corniche",
    images: tantaCorniche,
    palette: paletteCorniche,
    area: 140,
    year: 2024,
    rows: [
      [{ id: "reception", span: 5 }, { id: "reception-wall", span: 4, start: 8, align: "end" }],
      [{ id: "reception-entrance", span: 4, start: 2 }, { id: "corridor", span: 4, start: 8, align: "center" }],
      [{ id: "room", span: 5 }, { id: "bathroom-vanity", span: 4, start: 8, align: "end" }],
      [
        { id: "shower", span: 4 },
        { id: "guest-washroom", span: 4, align: "center" },
        { id: "kitchen", span: 4, align: "end" },
      ],
    ],
  },
  {
    slug: "tanta-riyadh",
    images: tantaRiyadh,
    palette: paletteRiyadh,
    area: 130,
    year: 2024,
    rows: [
      [{ id: "reception", span: 5 }, { id: "panelled-wall", span: 7, align: "center" }],
      [{ id: "moulding-wall", span: 5, start: 2 }, { id: "entrance", span: 4, start: 8, align: "end" }],
      [{ id: "corridor", span: 4, start: 2 }, { id: "oak-doors", span: 5, start: 7, align: "end" }],
      [{ id: "hallway", span: 5 }, { id: "bathroom", span: 4, start: 8, align: "center" }],
    ],
  },
  {
    slug: "tanta-ashraf",
    images: tantaAshraf,
    palette: paletteAshraf,
    area: 140,
    year: 2025,
    rows: [
      [{ id: "reception", span: 5 }, { id: "tv-wall", span: 4, start: 8, align: "end" }],
      [{ id: "fluted-wall", span: 4, start: 2 }, { id: "timber-columns", span: 5, start: 7, align: "center" }],
      [{ id: "framed-door", span: 5 }, { id: "doorway", span: 4, start: 8, align: "end" }],
      [
        { id: "corridor", span: 4 },
        { id: "shower", span: 4, align: "center" },
        { id: "vanity", span: 4, align: "end" },
      ],
    ],
  },
];

const texts: Record<Locale, Record<string, ProjectText>> = { en: projectTextEn, ar: projectTextAr };
const areaUnit: Record<Locale, string> = { en: "m²", ar: "م²" };

function build(layout: Layout, lang: Locale): Project {
  const text = texts[lang][layout.slug];
  const image = (id: string): ProjectImage => {
    const asset = layout.images[id];
    if (!asset) throw new Error(`Project ${layout.slug}: no photo "${id}" in its image manifest`);
    return { ...asset, alt: text.alt[id] ?? "" };
  };
  return {
    slug: layout.slug,
    title: text.title,
    seoTitle: text.seoTitle,
    seoDescription: text.seoDescription,
    tagline: text.tagline,
    summary: text.summary,
    facts: [
      { key: "location", value: text.location },
      { key: "area", value: `${layout.area} ${areaUnit[lang]}` },
      { key: "scope", value: text.scope },
      { key: "year", value: String(layout.year) },
      { key: "duration", value: text.duration },
    ],
    cover: image("cover"),
    palette: layout.palette,
    gallery: layout.rows.map((row) => ({ items: row.map(({ id, ...place }) => ({ image: image(id), ...place })) })),
  };
}

const built: Record<Locale, Project[]> = {
  en: layouts.map((l) => build(l, "en")),
  ar: layouts.map((l) => build(l, "ar")),
};

export const projectSlugs = layouts.map((l) => l.slug);

export function getProjects(lang: Locale) {
  return built[lang];
}

export function getProject(slug: string, lang: Locale) {
  return built[lang].find((p) => p.slug === slug);
}

/** One photo of a project by its manifest id (e.g. "cover", "reception"), with its description in `lang`. */
export function getProjectImage(slug: string, id: string, lang: Locale): ProjectImage | undefined {
  const layout = layouts.find((l) => l.slug === slug);
  const asset = layout?.images[id];
  if (!layout || !asset) return undefined;
  return { ...asset, alt: texts[lang][slug].alt[id] ?? "" };
}

export function galleryImages(project: Project) {
  return project.gallery.flatMap((row) => row.items.map((item) => item.image));
}
