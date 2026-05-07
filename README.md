# Silk & Velvet Events — Website

Static site to replace the existing 12-page Canva site at https://www.canva.com/design/DAGxGwiWxsU/. Hosted on Cloudflare Pages once a domain is registered.

## Status

**Pre-scaffold.** Currently three aesthetic mockups in `mockups/` for side-by-side comparison. Once a direction is chosen, the full Astro site will be scaffolded into `src/` and `public/`.

## Stack (planned)

| Layer | Choice | Why |
|---|---|---|
| Framework | Astro | Content-driven, zero JS by default, markdown content collections |
| Hosting | Cloudflare Pages | Oscar already runs 305 here; free CDN + Pages Functions if needed |
| Form | Formspree | Account already provisioned; submissions land in Sofiya's gmail |
| Domain | TBD | Sofiya to register; until then we run on `*.pages.dev` |
| CMS | None | Markdown files in git; Oscar pushes content updates |
| Repo | Private GitHub | New repo, separate from any client folder |

## Quick start (mockup review)

From this directory:

```sh
python3 -m http.server 8088
```

Then open:

- **Comparison page:** http://localhost:8088/mockups/
- **Variant A (Editorial):** http://localhost:8088/mockups/variant-a-editorial/
- **Variant B (Modern Soft):** http://localhost:8088/mockups/variant-b-modern-soft/
- **Variant C (Old-World):** http://localhost:8088/mockups/variant-c-old-world/

The comparison page shows all three side-by-side. Press `1`, `2`, `3` to focus a single variant; `0` returns to side-by-side.

> Port 4321 is in use by another Astro dev server on this machine — that's why we're on 8088. If 8088 is also taken, any free port works (try 8090, 9090).

## Folder structure

```
Website/
├── .impeccable.md              Locked design context (palette, fonts, principles)
├── README.md                   This file
├── mockups/                    3 aesthetic variants for review (delete once chosen)
│   ├── index.html              Side-by-side comparison
│   ├── variant-a-editorial/
│   ├── variant-b-modern-soft/
│   └── variant-c-old-world/
├── public/
│   ├── brand/
│   │   └── logo.png            S&V monogram from Sofiya
│   └── gallery/                Image storage (organized by category)
│       ├── balloon-decor/
│       ├── event-decor/
│       └── wedding-details/
├── src/                        (empty — populated when direction is chosen)
│   ├── content/                Markdown content collections (services, team, faq, reviews, process)
│   ├── components/             Astro components
│   ├── layouts/
│   ├── pages/
│   ├── styles/                 tokens.css + global
│   └── lib/                    Gallery manifest + contact channels
└── docs/
    ├── CONTENT-UPDATES.md      How to add a gallery image, update prices, etc.
    └── DEPLOY.md               Cloudflare Pages connect + custom domain steps
```

## Content update workflow (once shipped)

1. Sofiya texts/DMs Oscar new content (gallery photos, price update, new review)
2. Oscar edits the relevant markdown file in `src/content/` or drops images into `public/gallery/<category>/`
3. `git commit && git push`
4. Cloudflare Pages auto-deploys; live in ~30s

## Open items

See `../STATE.md` — `## Awaiting from Sofiya` lists what to ask her, `## Decisions outstanding` lists Oscar-side calls with defaults.

## Resume work (mid-build)

Direction locked 2026-05-04. Build plan at `~/.claude/plans/ok-i-need-you-inherited-rossum.md`.

```sh
cd "/Users/oscarg/en-Place/clients/silk-and-velvet-events/Website"
pnpm install
pnpm dev    # http://localhost:4321 (production scaffold)
```

For the original mockup comparison (kept as design reference until site ships):

```sh
python3 -m http.server 8088    # http://localhost:8088/mockups/
```

**Locked context:** Modern Soft (variant B) base + Editorial hero copy hybrid. Font spelling: **Halimun** (H-A-L-I-M-U-N). Services: 5 tiles with Balloon Decor split out. Contact channels: text/IG/Messenger/email — no WhatsApp. Deploy: Vercel + silkandvelvetevents.com (Porkbun DNS).
