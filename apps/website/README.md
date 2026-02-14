# Workshop Website

Public-facing landing page for the **ICML 2026** workshop on algorithmic foundations for medical AI in the real world.

## Tech Stack

- [Next.js 15](https://nextjs.org/) (App Router, static export)
- [React 19](https://react.dev/)
- [Tailwind CSS 4](https://tailwindcss.com/)
- [Radix UI](https://www.radix-ui.com/) (Accordion, Dialog, Slot)
- [Lucide Icons](https://lucide.dev/)
- TypeScript 5.9

## Development

```bash
# From the monorepo root
pnpm dev          # starts on http://localhost:3000

# Or from apps/website
pnpm dev          # next dev --turbopack
pnpm build        # next build (static export)
pnpm start        # serve production build
pnpm lint         # next lint
```

No environment variables are required. The site is fully static with no server-side data fetching.

## Project Structure

```
app/
  layout.tsx                 # Root layout — metadata, fonts, header/footer
  page.tsx                   # Home page composing all sections
  globals.css                # Global styles, CSS variables, typography

components/
  layout/
    header.tsx               # Fixed responsive nav with anchor links
    footer.tsx               # Contact info and external links
  sections/
    hero.tsx                 # Hero banner with CTA buttons
    about.tsx                # Workshop description
    topics.tsx               # 5 research topic cards
    call-for-papers.tsx      # Submission types, review info, dates
    virtual-clinic.tsx       # Interactive challenge description
    schedule.tsx             # Day schedule (morning/afternoon)
    speakers.tsx             # Invited speaker cards
    organizers.tsx           # Organizer cards with bios
    global-health-panel.tsx  # Panel description + organizations
    faqs.tsx                 # Accordion FAQ items
  ui/
    accordion.tsx            # Radix Accordion wrapper
    button.tsx               # CVA button with variants

lib/
  cn.ts                      # clsx + tailwind-merge utility
```

## Deployment

Deployed to [Vercel](https://vercel.com/) as a fully static site. All routes are prerendered at build time.
