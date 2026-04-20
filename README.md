# Creators Circle — Local Development

A full-stack platform for artists: build your site, share your work, grow your practice.

## Apps

- **Platform** (`localhost:3000`) — The Creators Circle member portal
- **Artist Sites** (`localhost:3001`) — Public artist sites (Will Sage at `/will-sage`)

## Prerequisites

- Node.js 20+
- pnpm (`npm install -g pnpm`)
- A Resend account (free tier) for magic link emails
- A Stripe account (test mode) for billing

## Quick Start

### 1. Install dependencies
```bash
pnpm install
```

### 2. Set up environment
```bash
cp .env.example apps/platform/.env.local
# Fill in RESEND_API_KEY and Stripe keys
```

The `NEXTAUTH_SECRET` and `DATABASE_URL` are pre-filled. Add your Resend and Stripe keys when ready — the app works without them in dev (magic links print to console, billing pages show UI but won't process payments).

### 3. Set up database
```bash
# From repo root:
node_modules/.bin/prisma db push --schema=prisma/schema.prisma
node_modules/.bin/prisma db seed --schema=prisma/schema.prisma
```

Or use the root-level scripts:
```bash
pnpm db:push
pnpm db:seed
```

### 4. Start dev servers
```bash
pnpm dev
# Platform:      http://localhost:3000
# Artist Sites:  http://localhost:3001
```

Or start individually:
```bash
cd apps/platform && pnpm dev      # port 3000
cd apps/artist-sites && pnpm dev  # port 3001
```

### 5. Sign in

**Admin account:**
```
Email: admin@creatorscircle.com
```

**Will Sage's account:**
```
Email: will@willsage.com
```

In development, magic links print to the terminal console instead of sending email. Look for:
```
🔗 Magic Link for admin@creatorscircle.com
http://localhost:3000/api/auth/callback/resend?...
```

## Database Management

```bash
# Open Prisma Studio (visual DB browser)
node_modules/.bin/prisma studio --schema=prisma/schema.prisma

# Re-seed (wipes existing seed data, then re-creates)
node_modules/.bin/prisma db seed --schema=prisma/schema.prisma

# Reset database entirely
node_modules/.bin/prisma db push --schema=prisma/schema.prisma --force-reset
node_modules/.bin/prisma db seed --schema=prisma/schema.prisma
```

## Project Structure

```
creators-circle/
├── apps/
│   ├── platform/          # Creators Circle app (port 3000)
│   └── artist-sites/      # Public artist sites (port 3001)
├── packages/
│   ├── db/                # Shared Prisma client export
│   └── config/            # Shared configs
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.ts            # Seed data (Will Sage site + sample artists)
└── dev.db                 # SQLite database (created after db:push)
```

## Key Features

### Creators Circle Platform
- **Dashboard** — Overview, quick stats, upcoming events
- **Site Builder** — Drag-and-drop page editor with 17 section types
- **Lanterns** — Community project updates feed with reactions
- **Programming** — Events calendar with RSVP
- **Billing** — Stripe-powered subscription management
- **Admin** — Artist management, event creation, analytics

### Will Sage Artist Site (`localhost:3001/will-sage`)
- **5 pre-built pages**: Home, About, Music, Offerings, Contact
- **Sage Dark theme**: cinematic, editorial feel with Cormorant Garamond
- Full-viewport hero sections, masonry gallery, offering cards, testimonials
- Responsive navigation with mobile menu

## Adding Stripe (optional for dev)

1. Get test keys from [dashboard.stripe.com](https://dashboard.stripe.com)
2. Create two products in Stripe: Creator ($29/mo) and Pro ($79/mo)
3. Add the price IDs to `.env.local`
4. For webhooks: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`

## Adding Email (optional for dev)

1. Get a free API key from [resend.com](https://resend.com)
2. Add `RESEND_API_KEY` to `.env.local`
3. Without a key, magic links still print to console in dev mode
