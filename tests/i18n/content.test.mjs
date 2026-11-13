// The two languages must stay in step: same dictionary shape, a description for every photo,
// and phone numbers typed in Arabic digits must be accepted.
import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { en } from "../../src/i18n/dictionaries/en.ts";
import { ar } from "../../src/i18n/dictionaries/ar.ts";
import { getProjects, galleryImages } from "../../src/lib/projects.ts";
import { localePath, switchLocalePath } from "../../src/i18n/config.ts";
import { consultationSchema, toAsciiDigits } from "../../src/lib/consultation.ts";

/** Every key path in an object, with array lengths, so missing or extra entries show up. */
function shape(value, path = "") {
  if (Array.isArray(value)) return [`${path}[${value.length}]`, ...value.flatMap((v, i) => shape(v, `${path}[${i}]`))];
  if (value && typeof value === "object") return Object.keys(value).sort().flatMap((k) => shape(value[k], `${path}.${k}`));
  return [`${path}:${typeof value}`];
}

describe("dictionaries", () => {
  test("Arabic and English have the same keys and list lengths", () => {
    assert.deepEqual(shape(ar), shape(en));
  });
  test("no Arabic string is left empty where the English one has text", () => {
    const strings = (value, path = "") =>
      value && typeof value === "object"
        ? Object.entries(value).flatMap(([k, v]) => strings(v, `${path}.${k}`))
        : typeof value === "string" ? [[path, value]] : [];
    const arabic = new Map(strings(ar));
    for (const [path, text] of strings(en)) {
      if (text) assert.ok(arabic.get(path), `missing Arabic text at ${path}`);
    }
  });
});

describe("projects", () => {
  for (const lang of ["ar", "en"]) {
    test(`every photo has a description (${lang})`, () => {
      for (const project of getProjects(lang)) {
        for (const image of [project.cover, ...galleryImages(project)]) {
          assert.ok(image.alt.length > 10, `${lang} ${project.slug}: ${image.src} has no description`);
        }
      }
    });
  }
  test("both languages list the same projects in the same order", () => {
    assert.deepEqual(
      getProjects("ar").map((p) => p.slug),
      getProjects("en").map((p) => p.slug),
    );
  });
});

describe("addresses", () => {
  test("English at the root, Arabic under /ar", () => {
    assert.equal(localePath("en", "/#work"), "/#work");
    assert.equal(localePath("ar", "/"), "/ar");
    assert.equal(localePath("ar", "/#work"), "/ar#work");
    assert.equal(localePath("ar", "/work/tanta-cafe"), "/ar/work/tanta-cafe");
  });
  test("the language switch keeps the page", () => {
    assert.equal(switchLocalePath("/work/tanta-cafe", "ar"), "/ar/work/tanta-cafe");
    assert.equal(switchLocalePath("/ar/work/tanta-cafe", "en"), "/work/tanta-cafe");
    assert.equal(switchLocalePath("/ar", "en"), "/");
    assert.equal(switchLocalePath("/", "ar"), "/ar");
    // "/areas" starts with the letters "ar" but is an English page
    assert.equal(switchLocalePath("/areas", "ar"), "/ar/areas");
    assert.equal(switchLocalePath("/ar/areas", "en"), "/areas");
  });
});

describe("booking form", () => {
  test("Arabic-Indic digits become ASCII", () => {
    assert.equal(toAsciiDigits("٠١٠ ١٢٣٤ ٥٦٧٨"), "010 1234 5678");
    assert.equal(toAsciiDigits("۰۱۲"), "012");
  });
  test("a phone number typed in Arabic digits is valid", () => {
    const result = consultationSchema.safeParse({
      fullName: "أحمد محمد",
      phone: "٠١٠ ١٢٣٤ ٥٦٧٨",
      email: "ahmed@example.com",
      projectType: "Apartment",
      locale: "ar",
    });
    assert.ok(result.success);
    assert.equal(result.data.phone, "010 1234 5678");
  });
});

import { services as servicesEn } from "../../src/content/services.en.ts";
import { services as servicesAr } from "../../src/content/services.ar.ts";

describe("service pages", () => {
  test("Arabic and English service content have the same shape", () => {
    assert.deepEqual(shape(servicesAr), shape(servicesEn));
  });
  test("every related project and cover photo exists", () => {
    for (const lang of ["ar", "en"]) {
      const slugs = new Set(getProjects(lang).map((p) => p.slug));
      const content = lang === "ar" ? servicesAr : servicesEn;
      for (const s of content.items) {
        for (const p of s.projects) assert.ok(slugs.has(p), `${lang} ${s.slug}: unknown project ${p}`);
        assert.ok(slugs.has(s.cover.project), `${lang} ${s.slug}: unknown cover project`);
      }
    }
  });
  test("search titles stay short and descriptions within snippet length", () => {
    for (const content of [servicesAr, servicesEn]) {
      for (const page of [content.hub, content.work, content.areas, ...content.items]) {
        assert.ok(page.seoTitle.length <= 60, `title too long: ${page.seoTitle}`);
        assert.ok(page.seoDescription.length <= 170, `description too long (${page.seoDescription.length}): ${page.seoTitle}`);
      }
    }
  });
});
