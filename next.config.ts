import type { NextConfig } from "next";

/*
 * Images: every photo is pre-sized by scripts/process_project_images.py and served through a
 * custom loader (components/work/ProjectImage.tsx), so the built-in image optimizer is unused
 * and needs no configuration.
 *
 * Languages: English pages live in src/app/(en) at the root, Arabic pages in src/app/(ar)/ar.
 * Each has its own root layout, so there is no single app/layout: unmatched addresses are
 * served by app/global-not-found.tsx.
 *
 * Caching: files in public/ keep their names when they change, so they are cached for a week and then
 * revalidated in the background (a returning visitor never waits for them). Fonts change almost never.
 */
const week = 60 * 60 * 24 * 7;
const year = 60 * 60 * 24 * 365;

if (process.env.NODE_ENV === "production" && !process.env.NEXT_PUBLIC_SITE_URL && !process.env.VERCEL_PROJECT_PRODUCTION_URL) {
  console.warn(
    "\n⚠ NEXT_PUBLIC_SITE_URL is not set: canonical links, the sitemap and share previews will point at localhost.\n" +
      "  Set it to the live address (e.g. https://mohamedelsaeed.com) before publishing.\n",
  );
}

const nextConfig: NextConfig = {
  experimental: {
    globalNotFound: true,
  },
  async headers() {
    return [
      { source: "/fonts/:file*", headers: [{ key: "Cache-Control", value: `public, max-age=${year}, immutable` }] },
      {
        source: "/:dir(work|images)/:path*",
        headers: [{ key: "Cache-Control", value: `public, max-age=${week}, stale-while-revalidate=${year}` }],
      },
    ];
  },
};

export default nextConfig;
