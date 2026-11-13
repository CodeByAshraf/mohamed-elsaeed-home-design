import type { ServicesContent } from "@/content/services.types";

/**
 * Service pages in English. Every fact comes from the company's actual work or from the portfolio
 * (areas, durations). Do not add figures or projects that are not real.
 */
export const services: ServicesContent = {
  ui: {
    home: "Home",
    services: "Services",
    work: "Work",
    areas: "Service areas",
    breadcrumb: "Breadcrumb",
    call: "Call now",
    callAria: "Call us on {number}",
    whatsapp: "WhatsApp",
    requestVisit: "Request a site visit or quote",
    includes: "What's included",
    stages: "Where do we start?",
    projects: "From our work",
    projectsNote: "Real projects we finished in Tanta, with their photos, areas and timelines.",
    faq: "Questions",
    otherServices: "Other services",
    allServices: "All services",
    allWork: "All work",
    explore: "Details",
    ctaTitle: "Ready to start?",
    ctaBody: "Book a site visit, or call or message us directly. You receive the quotation and timeline before any work begins.",
    viewProject: "View project",
  },
  hub: {
    seoTitle: "Finishing & Interior Design Services in Tanta",
    seoDescription:
      "Finishing company in Tanta: apartments, villas and shops finished from bare walls to turnkey, plus interior design, supervised by engineer Mohamed Elsaeed.",
    eyebrow: "Services",
    h1: "Finishing and interior design services",
    intro:
      "A finishing company based in Tanta, with design and execution under one roof. We take a unit at any stage and hand it over ready to live or work in, with engineering supervision by Mohamed Elsaeed throughout.",
    processTitle: "How we work",
    areasTitle: "Where do we work?",
    areasBody: "We are based in Tanta and work across Gharbia Governorate and Greater Cairo.",
  },
  work: {
    seoTitle: "Finishing & Interior Design Portfolio, Tanta",
    seoDescription:
      "Finishing and interior design projects in Tanta: apartments of 120–140 m² and a 100 m² café, with photos, areas and timelines. See the work and request a visit.",
    eyebrow: "Portfolio",
    h1: "Our finishing and interior design work",
    intro: "Every project here is real, built in Tanta and photographed room by room. Open one to see its spaces, materials and colours.",
  },
  areas: {
    seoTitle: "Finishing Company in Tanta, Gharbia & Greater Cairo",
    seoDescription:
      "Based in Tanta, we finish apartments, villas and shops across Gharbia Governorate and Greater Cairo: Cairo, Giza and Qalyubia. Request a site visit.",
    eyebrow: "Service areas",
    h1: "We work in Tanta, Gharbia and Greater Cairo",
    intro:
      "The company is based in Tanta, and from there we serve finishing and interior design projects across Gharbia Governorate and Greater Cairo. Wherever your project is, it starts with a site visit.",
    regions: [
      {
        title: "Tanta",
        body: "Our base, and the home of every project in the portfolio: Shubar, the Corniche, Riyadh Towers and Al Ashraf.",
      },
      {
        title: "Gharbia Governorate",
        body: "We work across Gharbia's cities and districts with the same method: a site visit and measurements, then design and quotation, then execution by our team with regular engineering supervision.",
      },
      {
        title: "Greater Cairo",
        body: "We carry out finishing projects in Cairo, Giza and Qalyubia. The quotation and timeline follow the site visit, before any work begins.",
      },
    ],
    howTitle: "How does a project outside Tanta start?",
    howBody:
      "Send us the location, the type of unit and its area. We arrange a site visit, then send the design, quotation and timeline, and work starts once you approve.",
  },
  items: [
    {
      slug: "apartment-finishing",
      name: "Apartment finishing",
      summary: "From bare walls or half-finished to turnkey.",
      seoTitle: "Apartment Finishing in Tanta, Bare Walls to Turnkey",
      seoDescription:
        "Finishing company in Tanta: complete apartment finishing with gypsum ceilings, lighting, flooring, joinery, kitchens and bathrooms, from bare walls to turnkey.",
      eyebrow: "Finishing",
      h1: "Apartment finishing in Tanta",
      intro:
        "We take your apartment at any stage, bare walls or half-finished, and carry it to the last one: a turnkey finish, ready to live in. One design, one team and one point of responsibility from the site visit to the keys.",
      cover: { project: "tanta-shubar", id: "cover" },
      stages: [
        {
          title: "Bare walls",
          body: "We start with the groundwork: electrics, plumbing and plaster laid out to the approved design, then finish to the end.",
        },
        {
          title: "Half-finished",
          body: "We inspect the existing groundwork first and settle what needs correcting before building on it, then finish to handover.",
        },
        {
          title: "Turnkey (super lux)",
          body: "The final stage: gypsum ceilings and concealed light, flooring and marble, paint and wall panels, doors and joinery, kitchens and bathrooms.",
        },
      ],
      includes: [
        "Interior design and space planning",
        "Electrical and plumbing groundwork",
        "Plaster, gypsum ceilings and concealed light",
        "Flooring, tiles and marble",
        "Paint and wall panelling",
        "Doors, joinery and wardrobes",
        "Kitchens and bathrooms",
        "Engineering supervision to handover",
      ],
      sections: [
        {
          title: "How long does finishing an apartment take?",
          body: "The 120–140 m² apartments in our portfolio took three to four months. It depends on the area, the unit's condition and the materials, and you receive a written timeline with the quotation.",
        },
      ],
      projects: ["tanta-shubar", "tanta-riyadh", "tanta-corniche", "tanta-ashraf"],
      faq: [
        {
          q: "Do you finish half-finished apartments?",
          a: "Yes. We inspect the existing groundwork before starting, settle what needs correcting, and finish to the end.",
        },
        {
          q: "Is design included?",
          a: "Yes. Design and execution are done by the same team, so what you approve in the design is what gets built.",
        },
        {
          q: "How much does it cost?",
          a: "It depends on the area, the unit's condition and the materials you choose. After the site visit you receive a detailed quotation before any work begins.",
        },
      ],
    },
    {
      slug: "villa-finishing",
      name: "Villa finishing",
      summary: "Floors, stairs and tall spaces, from design to handover.",
      seoTitle: "Villa Finishing in Tanta, Gharbia & Greater Cairo",
      seoDescription:
        "Complete villa finishing from design to handover: floor layouts and stairs, ceilings and lighting, marble, joinery, kitchens and bathrooms. Based in Tanta.",
      eyebrow: "Finishing",
      h1: "Villa finishing",
      intro:
        "A villa means more space and more detail: several floors, stairs, a wide reception and tall ceilings that need careful lighting. We finish villas completely, from design to handover, with the method and precision you see in our projects.",
      cover: { project: "tanta-ashraf", id: "reception" },
      stages: [
        {
          title: "Bare walls",
          body: "We start with a site visit and measurements, then design each floor's layout and lighting before the groundwork.",
        },
        {
          title: "Half-finished",
          body: "We review the existing groundwork on every floor, settle what needs correcting, then finish to the end.",
        },
        {
          title: "Handover",
          body: "Ceilings and lighting, flooring and marble, stairs and joinery, kitchens and bathrooms, ready to live in.",
        },
      ],
      includes: [
        "Floor and space planning",
        "Stairs and balustrades",
        "Ceilings and lighting for tall spaces",
        "Flooring and marble",
        "Paint and wall cladding",
        "Doors, joinery and dressing rooms",
        "Kitchens and bathrooms",
        "Engineering supervision at every stage",
      ],
      sections: [
        {
          title: "One plan for every floor",
          body: "In a villa the floors are tied together by the stair, the lighting and the materials, so we design the whole villa as one before work starts, and agree the order of works and timeline after the site visit.",
        },
      ],
      projects: ["tanta-ashraf", "tanta-riyadh", "tanta-corniche"],
      faq: [
        {
          q: "Do you finish villas outside Tanta?",
          a: "Yes. We work across Gharbia Governorate and Greater Cairo, and every project starts with a site visit.",
        },
        {
          q: "Can a villa be finished in phases?",
          a: "We agree the order of works and the timeline after the site visit, according to the villa's condition and your needs.",
        },
      ],
    },
    {
      slug: "interior-design",
      name: "Interior design",
      summary: "Design and execution by the same team.",
      seoTitle: "Interior Designer in Tanta: Design & Execution",
      seoDescription:
        "Interior design in Tanta by an engineer who builds what he draws: space planning, materials and colours, lighting, panelling and joinery, to the last detail.",
      eyebrow: "Design",
      h1: "Interior design",
      intro:
        "Design that starts from how you live: how you move through the home, what each room needs, and how the space should feel. Then the same team builds what was drawn, so nothing is lost between paper and site.",
      cover: { project: "tanta-ashraf", id: "cover" },
      stages: [],
      includes: [
        "Space planning and built-in furniture",
        "Materials and colour palette",
        "Lighting and ceiling design",
        "Wall panelling and timber cladding",
        "Kitchen and bathroom design",
        "Site follow-up to the last detail",
      ],
      sections: [
        {
          title: "Why design and build together?",
          body: "When the engineer who designs also builds, every detail stays where it was drawn: light lines, joinery sizes, the meeting of materials. Each project page shows its colour palette, taken from its photographs, so you can see how the materials work together.",
        },
      ],
      projects: ["tanta-ashraf", "tanta-shubar", "tanta-corniche"],
      faq: [
        {
          q: "What do I receive at the design stage?",
          a: "The approved layout, materials and lighting, with a quotation and a timeline for the works.",
        },
        {
          q: "Can I ask for design only?",
          a: "Tell us about your project and we agree the right scope after the consultation.",
        },
      ],
    },
    {
      slug: "commercial-finishing",
      name: "Shops, cafés and offices",
      summary: "Commercial spaces designed around how they work.",
      seoTitle: "Shop, Café & Office Finishing in Tanta",
      seoDescription:
        "Design and finishing of commercial spaces in Tanta: cafés, shops and offices designed around how they work. See a 100 m² café we finished in two months.",
      eyebrow: "Finishing",
      h1: "Shop, café and office finishing",
      intro:
        "A commercial space works for you or against you: how customers move, where they sit, the lighting and the identity of the place. We design and finish shops, cafés and offices around how they work, and hand them over ready to open.",
      cover: { project: "tanta-cafe", id: "cover" },
      stages: [],
      includes: [
        "Layout and customer flow",
        "Identity and feature walls",
        "Counters and bespoke joinery",
        "Ceilings and lighting",
        "Flooring and cladding",
        "Engineering supervision to handover",
      ],
      sections: [
        {
          title: "An example from our work",
          body: "The Tanta Café: 100 m² finished in two months, with an open stair to an upper level of extra seating, swing seats along the full-height window, and banquettes that free the floor for tables.",
        },
      ],
      projects: ["tanta-cafe"],
      faq: [
        {
          q: "How long does a shop or café take?",
          a: "The 100 m² Tanta Café took two months. Every project gets its own timeline with the quotation, after the site visit.",
        },
      ],
    },
  ],
};
