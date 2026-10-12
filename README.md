# FORMA X — Architecture & Interior Studio

Premium static website template for architecture studios, interior designers, and renovation companies. Sold by BilguunSoft.

The interface is in Mongolian Cyrillic. English is used only for artistic labels and sample project names.

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build
npm start
```

## Deploy on Vercel

1. Push the project to Git.
2. Import it in Vercel.
3. Framework preset: Next.js.
4. Build command: `npm run build`.
5. No database, environment variables, or paid services are required.

Optional contact endpoint:

```bash
NEXT_PUBLIC_FORMSPREE_ENDPOINT=https://formspree.io/f/xxxxxxxx
```

## Customize the company

Edit `src/config/site.ts`.

- `name`, `fullName`, `logoText`, `tagline`, `description`
- `url` — real domain, used for SEO, sitemap, and Open Graph
- `contact.phone`, `contact.phoneHref`, `contact.email`, `contact.address`, `contact.hours`
- `socials`
- `seo.title`, `seo.description`, `seo.keywords`, `seo.ogImage`
- `theme` — background, secondary, paper, lime, sage, stone, mist
- `credits.text` and `credits.url` — footer credit. Default text is `Website by BilguunSoft`
- `copyrightYear`
- `isRealBusiness` — keep `false` while the content is still the demo. Set `true` only after the name, phone, email, and address are real. Organization JSON-LD is added only then.

Theme colors are applied as CSS variables from `site.ts`. Tailwind utilities such as `bg-ink`, `text-lime`, and `bg-paper` follow those variables.

## Change the text

Homepage copy lives in `src/data/content.ts`.

Navigation labels live in `src/data/navigation.ts`.

Service copy lives in `src/data/services.ts`.

Keep Mongolian Cyrillic for body copy. English is appropriate for short artistic labels.

## Replace images

Put new files in `public/images/` and keep the same filenames, or update the paths in:

- `src/data/projects.ts`
- `src/data/services.ts`
- `src/components/home/Hero.tsx`
- `src/components/home/CinematicSection.tsx`
- `src/config/site.ts` (`seo.ogImage`)

Recommended size: 1600–2000px wide, compressed JPEG or WebP.

The current photos are Unsplash previews. They are not real client projects. See `public/images/LICENSES.txt`. Replace them before a client launch. The Unsplash License does not allow selling those photos as stock.

## Add a project

Add an object to the `projects` array in `src/data/projects.ts`.

```ts
{
  slug: "new-house",
  name: "NEW HOUSE",
  number: "04",
  category: "architecture", // architecture | interior | renovation
  year: "2026",
  location: "Улаанбаатар",
  area: "180 м²",
  client: "Жишээ үзэл баримтлал",
  cover: "/images/your-cover.jpg",
  coverAlt: "Тайлбар",
  gallery: [{ src: "/images/your-cover.jpg", alt: "Тайлбар" }],
  summary: "Богино тайлбар.",
  description: ["Дэлгэрэнгүй догол мөр."],
  materials: ["Бетон"],
  sample: true,
}
```

`sample: true` keeps the demo label. The project page is generated from this file at `/projects/new-house`.

## Contact form

This is a static site. It does not include a backend, and it never pretends a message was sent.

`contact.mode` in `src/config/site.ts`:

| Mode | Behavior |
| --- | --- |
| `demo` | Shows a demo notice. Nothing is submitted. |
| `mailto` | Opens the visitor's email app to `contact.email`. |
| `formspree` | Posts to `contact.formspreeEndpoint` or `NEXT_PUBLIC_FORMSPREE_ENDPOINT`. |

## Motion

A Motion ON/OFF control sits at the bottom left. The choice is saved in `localStorage`.

`prefers-reduced-motion` starts the site with motion off. The visitor can turn it back on.

GSAP, Lenis, the custom cursor, and the 3D scene respect that setting. The cursor is desktop-only and hidden on touch screens.

## Animation

- Headlines: `src/components/effects/RevealText.tsx`
- Smooth scroll: `src/components/effects/SmoothScroll.tsx`
- Preloader: `src/components/effects/Preloader.tsx` (once per browser session)
- 3D object: `src/components/three/ArchitectureScene.tsx`
- If WebGL is unavailable, a CSS geometric mark is shown instead

GSAP timelines are created inside `gsap.context` and reverted on cleanup. The Three.js canvas is loaded only on desktop, with `ssr: false`, and its frame loop pauses off screen. React Three Fiber disposes the renderer when the canvas unmounts.

## Fonts

Loaded with `next/font` from Google Fonts, with Cyrillic subsets:

- Sofia Sans Extra Condensed — display
- Manrope — body
- Unbounded — labels

## Static export

Vercel deployment does not need `output: "export"`.

For a fully static `out/` folder, set this in `next.config.ts` and rebuild:

```ts
const nextConfig: NextConfig = {
  output: "export",
  cacheComponents: false,
  images: { unoptimized: true },
};
```

Remove `partialPrefetching` as well if the build asks for it. Project pages already use `generateStaticParams`.

## Scripts

```bash
npm run dev
npm run build
npm start
npm run lint
```
