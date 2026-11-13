import type { Metadata } from "next";
import { Hero } from "@/components/home/Hero";
import { AboutSection } from "@/components/home/AboutSection";
import { ContactSection } from "@/components/home/ContactSection";
import { ServicesSection } from "@/components/home/ServicesSection";
import { WorkSection } from "@/components/work/WorkSection";
import { IntroOverlay } from "@/components/home/IntroOverlay";
import { PlanSection } from "@/components/home/PlanSection";
import { FaqSection } from "@/components/home/FaqSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { getDictionary, type Locale } from "@/i18n";
import { pageMetadata } from "@/lib/seo";

export function homeMetadata(lang: Locale): Metadata {
  const { meta } = getDictionary(lang);
  return pageMetadata({ lang, path: "/", title: meta.title, description: meta.description, absoluteTitle: true });
}

export function HomePage({ lang }: { lang: Locale }) {
  return (
    <>
      <IntroOverlay />
      <main id="main">
      <Hero />
      <WorkSection lang={lang} />
      <PlanSection lang={lang} />
      <ServicesSection lang={lang} />
      <AboutSection />
      <TestimonialsSection lang={lang} />
      <FaqSection lang={lang} />
      <ContactSection lang={lang} />
      </main>
    </>
  );
}
