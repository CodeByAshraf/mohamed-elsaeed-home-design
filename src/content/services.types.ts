/** Shape of the service pages' content (src/content/services.ar.ts and services.en.ts). */
export type ServiceSlug = "apartment-finishing" | "villa-finishing" | "interior-design" | "commercial-finishing";

export type ServiceContent = {
  slug: ServiceSlug;
  /** Short name for cards, menus and breadcrumbs. */
  name: string;
  /** One line for the services overview. */
  summary: string;
  seoTitle: string;
  seoDescription: string;
  eyebrow: string;
  h1: string;
  intro: string;
  /** A real photo from the portfolio: project slug and photo id in its image manifest. */
  cover: { project: string; id: string };
  /** Starting points (bare walls, half-finished, turnkey). Empty when not relevant. */
  stages: { title: string; body: string }[];
  includes: string[];
  sections: { title: string; body: string }[];
  /** Related real projects (slugs). */
  projects: string[];
  faq: { q: string; a: string }[];
};

export type ServicesContent = {
  ui: {
    home: string;
    services: string;
    work: string;
    areas: string;
    breadcrumb: string;
    call: string;
    callAria: string;
    whatsapp: string;
    requestVisit: string;
    includes: string;
    stages: string;
    projects: string;
    projectsNote: string;
    faq: string;
    otherServices: string;
    allServices: string;
    allWork: string;
    explore: string;
    ctaTitle: string;
    ctaBody: string;
    viewProject: string;
  };
  hub: {
    seoTitle: string;
    seoDescription: string;
    eyebrow: string;
    h1: string;
    intro: string;
    processTitle: string;
    areasTitle: string;
    areasBody: string;
  };
  work: { seoTitle: string; seoDescription: string; eyebrow: string; h1: string; intro: string };
  areas: {
    seoTitle: string;
    seoDescription: string;
    eyebrow: string;
    h1: string;
    intro: string;
    regions: { title: string; body: string }[];
    howTitle: string;
    howBody: string;
  };
  items: ServiceContent[];
};
