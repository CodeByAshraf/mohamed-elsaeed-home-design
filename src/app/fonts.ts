import localFont from "next/font/local";

/*
 * Latin fonts are self-hosted through next/font: preloaded from the page <head> and given a
 * size-matched fallback so text does not jump when the real font arrives. Licences:
 * src/app/fonts/OFL-*.txt (SIL Open Font License).
 *
 * The Arabic faces (Amiri for display, Alexandria for text) are declared in globals.css with an
 * Arabic-only unicode-range, so English pages never download them; the Arabic layout preloads them.
 */
export const bodoni = localFont({
  src: [{ path: "./fonts/bodoni-moda-latin-opsz-normal.woff2", weight: "400 900", style: "normal" }],
  variable: "--font-bodoni",
  display: "swap",
  adjustFontFallback: "Times New Roman",
  // Names are written unquoted in the generated CSS, so none may contain a word starting with a digit
  // ("Bodoni 72" would invalidate the whole list). The full fallback stack is in globals.css.
  fallback: ["Didot", "Georgia", "serif"],
});

export const jost = localFont({
  src: [{ path: "./fonts/jost-latin-wght-normal.woff2", weight: "100 900", style: "normal" }],
  variable: "--font-jost",
  display: "swap",
  adjustFontFallback: "Arial",
  fallback: ["Helvetica Neue", "Arial", "sans-serif"],
});


/**
 * The italic, as its own family and not preloaded: it only sets taglines and quotes further down the
 * page, so it should not compete with the first screen. Used by `.font-display.italic` (globals.css).
 */
export const bodoniItalic = localFont({
  src: [{ path: "./fonts/bodoni-moda-latin-opsz-italic.woff2", weight: "400 900", style: "italic" }],
  variable: "--font-bodoni-italic",
  display: "swap",
  preload: false,
  adjustFontFallback: "Times New Roman",
  fallback: ["Didot", "Georgia", "serif"],
});
