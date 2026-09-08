# Receipt Doppel

Verified-purchase social proof that also hunts and takes down fake review farms and brand impersonators.

Payment-bound testimonials (Stripe / Paddle) + impersonation defense in one forest-green trust product.

## Quick start

```bash
cd receipt-doppel
cp .env.example .env
npm install
npx prisma migrate dev
npx prisma db seed
npm run build
npm start
```

For local iteration: `npm run dev` (same host/port).

App binds to **http://127.0.0.1:4317** (also `0.0.0.0:4317`).

Set a unique `AUTH_SECRET` in `.env` before any non-local deploy. The JWT cookie is signed with that value.

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
| `/review/[token]` | Post-purchase thank-you (one sentence, skip allowed) |
| `/review/find/[brandSlug]` | Lost-link lookup with email + order number |
| `/proof/[brandSlug]` | Public proof wall |
| `/badge-demo` | Trust badge on a fake PDP |
| `/embed/[brandSlug]` | Embeddable proof iframe |
| `/app` | Brand console (testimonials + threat queue) |
| `/app/threats/[id]` | Threat detail + takedown |
| `/app/settings` | Demo Stripe/Paddle connect, profile, embed codes |

## API

- `POST /api/auth/login|signup|logout` · `GET /api/auth/me`
- `GET|PATCH /api/testimonials`
- `GET|POST /api/charges` · `POST /api/charges/[id]/invite` · `PATCH /api/charges/[id]/status`
- `POST /api/reviews` (submit) · `PUT /api/reviews` (lost thank-you lookup)
- `GET /api/proof?slug=`
- `GET|PATCH /api/threats`
- `GET /api/proof?slug=`
- `POST|DELETE /api/payments/sync` (demo connect, no real secrets)
- `PATCH /api/brands`

## Stack

Next.js App Router · TypeScript · Tailwind · shadcn-style Radix UI · Prisma · SQLite

## Notes

Payment connect is a **demo**. It stores a fake account id. Record a paid order in the console to mint a thank-you URL (Stripe success page / cafe QR). Buyers are not asked to create an account. The quote cannot publish unless the charge is still `paid`.
