import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { bodoni, bodoniItalic, jost } from "./fonts";
import { NotFoundView } from "@/components/pages/NotFoundView";
import { siteUrl } from "@/lib/site";

/* Any address that matches no page, in either language. English first (the site's main language),
   with a way to the Arabic site. */
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Page not found | الصفحة غير موجودة",
  robots: { index: false },
};

export default function GlobalNotFound() {
  return (
    <html lang="en" dir="ltr" className={`${bodoni.variable} ${bodoniItalic.variable} ${jost.variable}`}>
      <body className="bg-basalt text-travertine">
        <NotFoundView lang="en" />
        <p lang="ar" dir="rtl" className="-mt-24 px-6 pb-16 text-center text-[15px] text-smoke sm:px-10">
          الصفحة غير موجودة.{" "}
          <Link href="/ar" className="text-travertine underline underline-offset-4">
            انتقل إلى الموقع العربي
          </Link>
        </p>
      </body>
    </html>
  );
}
