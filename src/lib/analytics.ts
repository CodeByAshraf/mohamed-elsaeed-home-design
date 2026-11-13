/**
 * Google Analytics 4 events for enquiries. Does nothing unless GA4 is set up
 * (NEXT_PUBLIC_GA_ID, see components/seo/Analytics.tsx), so it is safe to call anywhere.
 * In GA4, mark `generate_lead` as a key event to count enquiries by channel.
 */
type Channel = "call" | "whatsapp" | "form";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackLead(channel: Channel) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", "generate_lead", { method: channel, page_path: window.location.pathname });
}
