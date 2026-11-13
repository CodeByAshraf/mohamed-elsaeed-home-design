import Script from "next/script";

/**
 * Google Analytics 4, only when NEXT_PUBLIC_GA_ID (e.g. "G-XXXXXXX") is set. Loaded after the page
 * is idle, so it never slows the first screen. Enquiries are reported as `generate_lead` events
 * (src/lib/analytics.ts): calls, WhatsApp and the booking form.
 */
export function Analytics() {
  const id = process.env.NEXT_PUBLIC_GA_ID;
  if (!id || !/^G-[A-Z0-9]+$/.test(id)) return null;
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${id}`} strategy="lazyOnload" />
      <Script id="ga4" strategy="lazyOnload">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());gtag('config','${id}');`}
      </Script>
    </>
  );
}
