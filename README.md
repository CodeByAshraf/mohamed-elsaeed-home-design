# Mohamed Elsaeed – Home Design

Bilingual portfolio (English first, Arabic second): hero, selected work, services and process,
the designer, consultation booking and WhatsApp contact.
Next.js 16, TypeScript, Tailwind CSS v4, Framer Motion, Lucide, Zod, Nodemailer.

## Languages

- English is the main language, at the root: `/`, `/work/<slug>`. Arabic is under `/ar`: `/ar`, `/ar/work/<slug>`.
- Each language has its own root layout (`src/app/(en)/layout.tsx`, `src/app/(ar)/layout.tsx`), so the page
  is served with the right `<html lang dir>` from the first byte. The pages themselves are shared
  (`src/components/pages/*`) and receive the language.
- All visible text: `src/i18n/dictionaries/ar.ts` and `en.ts` (same shape; TypeScript and `npm test` check it).
  Project words and photo descriptions: `src/content/projects.ar.ts` and `projects.en.ts`.
- The navbar has a language switch that keeps the visitor on the same page.
- Right-to-left layout uses logical properties (`ms-`, `pe-`, `start-`, `border-s`…). Arrows, the underline
  animation, the booking panel and the photo viewer (keys and swipe) all follow the reading direction.
- Arabic type: Amiri (headings) and Alexandria (text), in `public/fonts`, declared in `globals.css` with an
  Arabic-only `unicode-range`: Latin words and numbers keep Bodoni and Jost, and English pages never load them.
  Arabic-specific typography (no letter-spacing, no italics, taller lines) is the "Arabic typography" block
  at the end of `globals.css`.
- Search engines: each page declares its other-language twin (`hreflang`), the sitemap lists both, and
  every page carries schema.org data for the studio (`src/components/seo/StructuredData.tsx`).

## Tests

    npm test     # booking API limits, image sizes, and that the two languages stay in step

## Run

    npm install
    cp .env.example .env.local   # then fill in the values (see below)
    npm run dev                  # http://localhost:3000
    npm run build && npm start   # production

## 1. Consultation emails

The "Book Consultation" / "Start Your Project" buttons open a booking form. Each request is
validated on the browser and again on the server (`src/app/api/consultation/route.ts`), then
emailed to `MAIL_TO` (a4rfmagdy@gmail.com) as a formatted message. Replying to that email
answers the client directly. The email says which language the visitor used, and numbers typed
in Arabic digits (٠١٠…) are accepted.

Sending through Gmail:
1. Use the Google account that should send the emails (it can be a4rfmagdy@gmail.com itself).
2. Turn on 2-Step Verification: https://myaccount.google.com/security
3. Create an App Password: https://myaccount.google.com/apppasswords
4. In `.env.local` set `SMTP_USER` to that Gmail address and `SMTP_PASS` to the 16-character app password.

On Vercel (or any host), add the same variables in the project's Environment Variables settings.
Any other SMTP provider (Zoho, Outlook, Resend SMTP, Brevo…) works by changing `SMTP_HOST`/`SMTP_PORT`.

Protection built in: server-side validation, a hidden honeypot field against bots,
HTML-escaping of everything the visitor types, and a limit of 5 requests per 10 minutes per IP.

## 2. WhatsApp and social links

- WhatsApp: +20 106 660 8039, set in `src/lib/site.ts` (`whatsapp.number`, digits only).
  Used by the floating button and the Contact section; both open a chat with that number
  in a new tab, with the greeting in `whatsapp.message` pre-filled.
  `NEXT_PUBLIC_WHATSAPP_NUMBER` can override it without editing code (rebuild after changing).
- Facebook, Instagram, TikTok: `site.social` in `src/lib/site.ts`. They appear as a vertical
  rail on the hero's left edge (desktop), in the mobile menu, and in the Contact section.

## Publishing

Set `NEXT_PUBLIC_SITE_URL` to the live address (e.g. https://mohamedelsaeed.com) so shared links show the right preview image.

## 3. Adding a project to the portfolio

1. Put the original photos in a folder.
2. Copy `scripts/projects/tanta-shubar.json` to `scripts/projects/<new-slug>.json` and list the
   photos in the order a visitor should walk through the home. Give the cover its own entry
   with `"id": "cover"`. Add `"crop": [left, top, right, bottom]` to remove frames or watermarks.
3. Run `python3 scripts/process_project_images.py scripts/projects/<new-slug>.json`
   (needs Python with Pillow). It writes resized WebP copies to `public/work/<new-slug>/`
   (metadata stripped) and a manifest to `src/data/projects/<new-slug>.images.json`.
4. In `src/lib/projects.ts`, import the manifest and add a layout entry: area, year and gallery rows
   (each photo's id, column span and alignment on desktop).
5. Add the project's words to BOTH `src/content/projects.ar.ts` and `src/content/projects.en.ts`: title,
   tagline, summary, location, scope, duration and a description for every photo (`npm test` checks this).

The homepage Work section and the page at `/work/<new-slug>` update automatically.

## Brand assets

- `src/components/brand/markPath.ts`: the official ME monogram as a vector path, traced from the
  logo artwork (99.3% overlap with the original shape). `Monogram.tsx` renders it in the brand gold.
- `src/app/icon.svg` (browser tab), `src/app/apple-icon.png` (iPhone home screen) and
  `src/app/opengraph-image.png` (the image shown when the site link is shared) are all made from it.
- Brand gold: `#B28F5E` (`--color-bronze` in `globals.css`), sampled from the logo.

## The opening ("From the first line")

The first time a visitor opens the homepage (in either language) a short opening plays: a drawing
sheet lays out its grid, the gold monogram is traced as one line and filled, the letters of the name
arrive scattered and tumbling and settle into place, and a dimension line closes the composition.
The sheet then fades over the hero's own dark partitions, which carry on into the hero's entrance.

- About 2.75 seconds. Click, tap, scroll or any key skips it.
- Once per browser tab (sessionStorage key `me-intro`), never with "reduce motion", never on other pages.
- CSS only ("Intro" at the end of `globals.css`), decided by the inline `<head>` script before the first
  paint (`src/components/motion/revealScript.ts`), so there is no flash and nothing to download.
  `src/components/home/IntroOverlay.tsx` holds the markup, the skip and the clean-up.
- `--intro-delay` holds back every hero entrance until the sheet clears. To turn the opening off,
  delete `<IntroOverlay />` from `src/components/pages/HomePage.tsx`.

## Scroll animations that show the engineering

- **Plan to reality** (`src/components/home/PlanSection.tsx`, after the Work section): the section pins
  while the visitor scrolls, and a 120 m² apartment plan at 1:50 draws itself in four stages that follow
  the studio's method: Survey (walls, windows, site dimensions), Layout (doors, furniture, rooms and
  areas), Lighting (concealed light lines and spotlights come on) and Finish (a real project photo,
  the Riyadh Towers reception, wipes in over its drawing and links to the project).
  Pure CSS scroll-driven animations ("Plan" in `globals.css`); each drawn group carries its scroll
  range as `--a`/`--b` percentages. Browsers without scroll-driven animations, and visitors who prefer
  reduced motion, get the finished plan with the four stages listed beside it.
- **Survey marks** on every project cover (`ProjectFeature.tsx`): crop corners close in and a dimension
  line with the project's area draws across the photo as it scrolls into view.
- **Scroll ruler** (`src/components/layout/ScrollRuler.tsx`, desktop): a surveyor's scale on the page
  edge whose ticks slide as the page scrolls, with a reading in metres that appears while moving.

## Colour palettes and the cursor

- **Palettes**: `python3 scripts/extract_palette.py [slug]` clusters every photo of a project and writes
  its six main colours (lightest first, with their share of the photographs) to
  `src/data/projects/<slug>.palette.json`. Project pages show them as paint chips (tap to copy the hex
  code); homepage cards show them as one thin bar. Re-run it after changing a project's photos.
- **Cursor** (`src/components/layout/CustomCursor.tsx`): on mouse devices a bronze point and a trailing
  ring; over photographs the ring becomes a disc naming the action. Opt an element in with
  `data-cursor="view" | "open" | "drag"`. Off on touch screens and with reduced motion.

## The hero lamp

On computers, the pointer carries a warm pool of light across the hero photograph, and the room
comes into focus where it falls (a sharp copy, `living-room-sharp` in `scripts/projects/site-hero.json`,
seen through a soft circular window). On phones a soft light drifts slowly across the room instead.
Code: `src/components/home/useHeroLamp.ts` and "Hero lamp" in `globals.css`.

It is built to cost nothing while the pointer moves (measured with a 4x slower CPU: 0 ms of
blocking): only `transform` changes on three small layers, the sharp photo is fetched after the
page has loaded and decoded in advance, and visitors who prefer reduced motion never run it.

## Where things live

- `src/lib/site.ts`: facts that are the same in both languages: WhatsApp number, social links, city.
- `src/i18n/dictionaries/*.ts`: every visible word (navigation, hero, stats, services, process, about, contact, form).
- `src/components/home/ServicesSection.tsx`: services (four disciplines) and the five-step process (#services).
- `src/app/globals.css`: design tokens (colors, fonts, easing).
- `src/components/home/Hero.tsx`: hero layout, load sequence (partitions open, line draws, stats count) and scroll depth.
- `src/components/home/HeroHeadline.tsx`: the slogan and its animation (rise into focus, weight settles to bold, light pass). Final boldness is `FINAL_WEIGHT` (400–900).
- `src/components/consultation/*`: booking dialog, form and open buttons.
- `src/lib/consultation.ts`: validation rules shared by the form and the server.
- `src/lib/email-template.ts`: the email the studio receives.
- `src/components/layout/WhatsAppButton.tsx`: floating button with a scroll-progress ring.
- `src/components/layout/SocialLinks.tsx`: social links (rail and row layouts).
- `src/components/layout/MobileMenu.tsx`: full-screen phone menu (partition reveal, link descriptions, contact block). Link descriptions are `nav[].note` in the dictionaries.
- `src/components/home/AboutSection.tsx`: the designer section (#studio). Copy lives in `about` in the dictionaries; the portrait is `public/images/mohamed-elsaeed.webp`, served as-is (replace the file with the same name to update it).
- `src/components/home/ContactSection.tsx`: closing contact section (#contact) with the page footer. Copy lives in `contact` in the dictionaries.
- `src/components/motion/Interactions.tsx`: the click/hover language used by every button and link: Magnetic (lean toward the cursor), RollText (word roll), ArrowSwap, the directional `underline`, and `press` feedback. Reuse these for anything new that is clickable.
- `src/components/motion/Reveal.tsx`: shared scroll animations (fade-in, line masks, drawn dimension line).
- `src/hooks/usePrefersReducedMotion.ts`: hydration-safe reduced-motion check. Use it instead of framer-motion's `useReducedMotion` when the value changes what is rendered.
- `src/lib/projects.ts`: portfolio content (projects, facts, gallery layout, photo descriptions).
- `src/components/work/*`: homepage Work section, project page parts, gallery, full-screen viewer, and `ProjectImage` (serves the pre-sized WebP files, no runtime image processing).
- `src/app/work/[slug]/page.tsx`: the project page, pre-rendered for every project.
- `src/components/motion/classes.ts`: shared class recipes (`press`, `underline`). Import them from here, not from the client-only `Interactions.tsx`.

## Hero image

The hero uses `public/images/hero-living-room.jpg` (a free Unsplash stock photo, bundled with
the site so it always loads). To use your own project photo:

1. Point `living-room` and `living-room-sharp` in `scripts/projects/site-hero.json` at your photo
   (landscape, ideally 1600–2400px wide) and tune `blur`, `brightness` and `saturation` there.
2. Run `python3 scripts/process_project_images.py scripts/projects/site-hero.json`.
3. Describe the new photo in `hero.imageAlt` in both dictionaries.

If the image ever fails to load, the hero falls back to a dark gradient.

## Search (SEO)

Built so the site can be found for searches like "مهندس تشطيبات طنطا", "تشطيب شقق طنطا",
"مهندس ديكور طنطا" or "finishing engineer Tanta":

- Titles and descriptions name the service and the city in each language (`meta` in the dictionaries).
  The homepage's `<h1>` is the line above the slogan ("Interior design & finishing engineer in Tanta").
- Project pages are titled with scope, area and place, e.g. "شقة شوبر: تشطيب متكامل، 120 م² في شوبر، طنطا".
- Structured data (schema.org) on every page: the studio as a local contractor in Tanta, Gharbia (address,
  map position, phone, services, social profiles), the engineer, and the website; project pages add the
  project and breadcrumbs; the homepage FAQ adds FAQPage. Source: `src/components/seo/StructuredData.tsx`,
  `src/components/home/FaqSection.tsx`, `src/components/pages/ProjectPage.tsx`.
- Every page names its other-language twin (hreflang), and `sitemap.xml` lists both with their images.
- The FAQ answers what people search before hiring (cost, duration, areas, design + finishing) from facts
  in the portfolio. Edit it in `faq` in the dictionaries.

**Pages built for search** (each language, English at the root and Arabic under `/ar`):

| Page | Path | Main search it answers |
|---|---|---|
| Home | `/` | finishing company / finishing engineer in Tanta |
| Services | `/services` | finishing and interior design services in Tanta |
| Apartment finishing | `/services/apartment-finishing` | apartment finishing in Tanta, half-finished, super lux |
| Villa finishing | `/services/villa-finishing` | villa finishing in Tanta, Gharbia, Greater Cairo |
| Interior design | `/services/interior-design` | interior / décor engineer in Tanta, design and build |
| Shops, cafés, offices | `/services/commercial-finishing` | shop, café and office finishing in Tanta |
| Portfolio | `/work` and `/work/<project>` | real projects with areas and timelines |
| Service areas | `/areas` | finishing company in Tanta, Gharbia and Greater Cairo |

Service page words live in `src/content/services.ar.ts` / `services.en.ts`; `npm test` checks that both
languages match, every related project exists, titles stay ≤ 60 characters and descriptions ≤ 170.
Testimonials: add real ones to `src/content/testimonials.ts` and the homepage section appears.

**Google setup (owner's steps; nothing here needs an account from the code):**

1. Publish with `NEXT_PUBLIC_SITE_URL=https://<your-domain>` (the build warns if it is missing; on Vercel the
   production domain is used automatically).
2. **Search Console** (search.google.com/search-console): add a *Domain* property and verify it through your
   domain's DNS, or a *URL prefix* property with the HTML tag, putting only its `content` value in
   `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` and redeploying. Then *Sitemaps* → submit `sitemap.xml`, and use
   *URL inspection* → *Request indexing* for `/ar`, `/ar/services/apartment-finishing` and the other service pages.
3. **Rich results**: after publishing, test a few pages at search.google.com/test/rich-results and
   validator.schema.org (business, services, breadcrumbs, FAQ).
4. **Google Analytics 4** (analytics.google.com): create a property and a Web data stream for the domain, copy the
   Measurement ID (`G-…`) into `NEXT_PUBLIC_GA_ID`, redeploy. Calls, WhatsApp and booking-form submissions arrive
   as `generate_lead` events with `method` = call / whatsapp / form: in *Admin → Events*, mark `generate_lead` as a
   key event. Link GA4 to Search Console (*Admin → Product links*) to see search queries next to visits.
5. **Google Business Profile** (business.google.com): category *Contractor* (or *Interior designer*), the address
   inside Tanta (or hide it and list service areas: Tanta, Gharbia, Cairo, Giza, Qalyubia), phone +20 106 660 8039,
   website link, opening hours, and real project photos. Ask finished clients for Google reviews. Use exactly the
   same name, phone and city everywhere (site, profile, Facebook, Instagram).
6. **Follow-up**: in Search Console → *Performance*, watch queries such as "تشطيب شقق طنطا" and "شركة تشطيبات
   طنطا" (impressions first, then clicks), and *Pages* for anything not indexed.

## Performance notes

- Arabic fonts are subset to the standard Arabic letters, digits and punctuation (Amiri 100 KB → 39 KB per
  weight, Alexandria 31 KB → 23 KB). To rebuild them from the full files (npm packages `@fontsource/amiri`,
  `@fontsource-variable/alexandria`), run `pyftsubset` with
  `--unicodes="U+0020,U+060C,U+061B,U+061F,U+0621-063A,U+0640-0652,U+0654-0655,U+0660-066D,U+0670,U+06D4,U+200C-200F,U+FDF2" --layout-features='*' --flavor=woff2`.
- English pages never download an Arabic font (the language switch's "عربي" uses the system font).
- Only the upright Bodoni and Jost are preloaded; the Bodoni italic (taglines, quotes) is a separate family
  fetched when used.
- Framer Motion is loaded lazily (`LazyMotion` in `Providers.tsx`): pages ship the small `m` elements and
  the animation features arrive afterwards; drag is only loaded with the photo viewer.
- Files in `public/` are cached (fonts for a year, photos for a week with background revalidation),
  set in `next.config.ts`.

- Entrance animations and scroll reveals are CSS (`globals.css`), not JavaScript: content is in
  the HTML and visible even before scripts run. `src/components/motion/revealScript.ts` is a tiny
  inline script that reveals sections on scroll; if it never runs, everything is simply visible.
- The booking form (and its validation library) loads only when a booking button is used.
- The hero photo's blur, darkening and colour are baked into the image file
  (`scripts/projects/site-hero.json`), so the browser never filters a full-screen image live.
- Every photo is pre-sized to several widths by `scripts/process_project_images.py`; no image
  processing happens on the server at request time.
- Set `NEXT_PUBLIC_SITE_URL` when publishing: it is used for `sitemap.xml`, `robots.txt` and
  link-preview images.
