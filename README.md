# Prayas Sahyog Sewa Samiti — Professional Light Theme

A responsive React + TypeScript + Vite website for Prayas Sahyog Sewa Samiti, Bareilly. The refresh uses a restrained deep-teal, warm-ivory, white and muted-gold palette and gives the homepage a clearer mission, verified impact statistics, service areas, activity photos and future plans. Existing content, photos, donation poster and QR artwork are retained.

## Requirements
- Node.js 20 or newer recommended
- npm

## Run locally
```bash
npm install
npm run dev
```

## Production build
```bash
npm run build
npm run preview
```

The Vite production output is written to `dist/`. For Vercel, use the repository root as the project root, build command `npm run build`, and output directory `dist`.

## Notes
- Activity slides are loaded from `public/data/work-highlights.json`; fallback content is included in the React app.
- The contact form uses `mailto`. Configure `email` in `src/siteContent.ts` before publishing if you want it to open a pre-addressed email.
- Review organization statistics and payment details before making the site public.
