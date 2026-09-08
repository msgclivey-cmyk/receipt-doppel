# Receipt Doppel

Verified-purchase social proof that also hunts and takes down fake review farms and brand impersonators.

Payment-bound testimonials (Stripe / Paddle) + impersonation defense in one forest-green trust product.

## Quick start

```bash
cd receipt-doppel
npm install
npx prisma migrate dev
npx prisma db seed
npm run build
npm start
```

For local iteration: `npm run dev` (same host/port).

App binds to **http://127.0.0.1:4317** (also `0.0.0.0:4317`).

## Demo login

| Field    | Value              |
|----------|--------------------|
| Email    | `alex@acmebrew.co` |
| Password | `demo1234`         |

Seeded brand: **Acme Brew Co.** (`/proof/acme-brew`).

## Surfaces

| Route | What |
|-------|------|
| `/` | Marketing landing (hero, before/after proof, how it works) |
| `/pricing` | Proof / Guard / Enterprise |
| `/login` `/signup` | Demo auth (JWT cookie) |
| `/proof/[brandSlug]` | Public proof wall |
| `/badge-demo` | Trust badge on a fake PDP |
| `/embed/[brandSlug]` | Embeddable proof iframe |
| `/app` | Brand console (testimonials + threat queue) |
| `/app/threats/[id]` | Threat detail + takedown |
| `/app/settings` | Demo Stripe/Paddle connect, profile, embed codes |

## API

- `POST /api/auth/login|signup|logout` · `GET /api/auth/me`
- `GET|PATCH /api/testimonials`
- `GET|PATCH /api/threats`
- `GET /api/proof?slug=`
- `POST|DELETE /api/payments/sync` (demo connect, no real secrets)
- `PATCH /api/brands`

## Stack

Next.js App Router · TypeScript · Tailwind · shadcn-style Radix UI · Prisma · SQLite

Mockups live in `public/mockups/`.

## Notes

Payment connect is a **demo**. It stores a fake account id and can import one unpublished payment-bound testimonial — no Stripe/Paddle API keys required.
