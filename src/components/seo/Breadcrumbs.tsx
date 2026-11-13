import Link from "next/link";
import { JsonLd } from "@/components/seo/StructuredData";
import { siteUrl } from "@/lib/site";
import { localePath, type Locale } from "@/i18n";

export type Crumb = { name: string; path: string };

/** Visible breadcrumb trail plus its BreadcrumbList data. The last crumb is the current page. */
export function Breadcrumbs({ lang, items, label }: { lang: Locale; items: Crumb[]; label: string }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: `${siteUrl}${localePath(lang, c.path)}`,
    })),
  };
  return (
    <>
      <nav aria-label={label}>
        <ol className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-smoke">
          {items.map((c, i) => {
            const last = i === items.length - 1;
            return (
              <li key={c.path} className="flex items-center gap-3">
                {last ? (
                  <span aria-current="page" className="text-limestone">
                    {c.name}
                  </span>
                ) : (
                  <Link href={localePath(lang, c.path)} className="transition-colors hover:text-travertine">
                    {c.name}
                  </Link>
                )}
                {!last ? (
                  <span aria-hidden className="text-travertine/25">
                    /
                  </span>
                ) : null}
              </li>
            );
          })}
        </ol>
      </nav>
      <JsonLd data={data} />
    </>
  );
}
