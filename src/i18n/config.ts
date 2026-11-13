/**
 * Languages of the site. English is the main language and lives at the root ("/", "/work/…");
 * Arabic lives under "/ar" ("/ar", "/ar/work/…"). Each language has its own root layout
 * (src/app/(en) and src/app/(ar)), so <html lang dir> is right on the very first byte.
 * To make another language the main one, change `defaultLocale` and move the route folders.
 */
export const locales = ["en", "ar"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export const dirOf = (lang: Locale) => (lang === "ar" ? "rtl" : "ltr");

/** Open Graph locale codes (used for link previews). */
export const ogLocale: Record<Locale, string> = { ar: "ar_EG", en: "en_US" };

/**
 * The address of a page in a given language. `path` is written as the main-language (root) path:
 *   localePath("ar", "/")          → "/ar"
 *   localePath("ar", "/#work")     → "/ar#work"
 *   localePath("ar", "/work/x")    → "/ar/work/x"
 *   localePath("en", "/work/x")    → "/work/x"
 */
export function localePath(lang: Locale, path = "/") {
  if (lang === defaultLocale) return path;
  if (path === "/") return `/${lang}`;
  if (path.startsWith("/#")) return `/${lang}${path.slice(1)}`;
  return `/${lang}${path}`;
}

/** The same page in the other language, from the current pathname. */
export function switchLocalePath(pathname: string, to: Locale) {
  let bare = pathname;
  for (const lang of locales) {
    if (lang === defaultLocale) continue;
    if (pathname === `/${lang}`) bare = "/";
    else if (pathname.startsWith(`/${lang}/`)) bare = pathname.slice(lang.length + 1);
  }
  return localePath(to, bare);
}

/** Fills {placeholders} in a dictionary string. */
export function fill(text: string, values: Record<string, string | number>) {
  return text.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key] ?? `{${key}}`));
}
