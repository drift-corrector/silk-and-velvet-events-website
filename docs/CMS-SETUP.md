# CMS setup + maintenance

Sofiya edits the site at **https://silkandvelvetevents.com/admin**. This doc is
for Oscar — how the thing is wired, how to finish the auth setup, and the one
rule to remember when changing the CMS config.

## How it works

[Sveltia CMS](https://sveltiacms.app) is a git-based CMS: no database, no
server, no monthly cost. It's a static page at `/admin` that talks to the GitHub
API in the browser. Sofiya saves → it commits to `main` → Vercel rebuilds → the
site updates in about a minute.

The site itself stays a plain static Astro build. Nothing about the deployment
changes.

Editable content lives in two places:

| What | Where | Format |
|---|---|---|
| Photos, gallery categories, gallery page copy | `src/data/gallery.json` | JSON |
| Page headings + meta descriptions | `src/data/pages/*.json` | JSON |
| Phone, email, socials, service areas, footer line | `src/data/site.json` | JSON |
| Services, packages, FAQ, reviews, process, team | `src/content/**` | Markdown |

Uploads go to `public/uploads/` and are referenced as `/uploads/<file>`. Sveltia
converts to WebP and caps dimensions at 2048px **in the browser, before
committing** — a 9MB phone photo lands in git at a few hundred KB. That's what
makes storing images in the repo sane.

## Finish the auth setup

Sign-in needs a tiny OAuth relay because GitHub doesn't allow client-side OAuth
yet. It's free on Cloudflare Workers and, once deployed, needs no maintenance.

Steps 1–3 are **already done**. They're recorded here for the day something
breaks or needs rotating.

**1. Worker.** Deployed with `npx wrangler deploy` from a clone of
[sveltia-cms-auth](https://github.com/sveltia/sveltia-cms-auth) — no fork, no CI
connection, nothing on the GitHub account. It lives at:

    https://sveltia-cms-auth.oscar-genesin.workers.dev

To redeploy or update it, clone the repo again and run `npx wrangler deploy`.
The environment variables below survive redeploys — they're stored on the
worker, not in the repo.

**2. GitHub OAuth app** — "Silk & Velvet Site Editor", owned by
`drift-corrector`:
https://github.com/settings/applications/3762684

- Client ID: `Ov23liIPwpyAuVLINHhM`
- Callback URL: `https://sveltia-cms-auth.oscar-genesin.workers.dev/callback`

If the client secret ever leaks, generate a new one on that page and re-run the
`wrangler secret put` command below. Old secrets stop working immediately.

**3. Worker environment variables.** All three are stored encrypted on the
worker. Set or rotate any of them with:

```bash
printf '<value>' | npx wrangler secret put <NAME>
```

| Name | Value |
|---|---|
| `GITHUB_CLIENT_ID` | `Ov23liIPwpyAuVLINHhM` |
| `GITHUB_CLIENT_SECRET` | the secret from the OAuth app page |
| `ALLOWED_DOMAINS` | `silkandvelvetevents.com, *.silkandvelvetevents.com, localhost:4321` |

`ALLOWED_DOMAINS` is what stops someone else's site pointing at this worker to
borrow the OAuth app. `localhost:4321` is in there so `npm run dev` can sign in
too — drop it if you'd rather lock it down to production only.

**4. Point the CMS at it.** Done — `base_url` in `public/admin/config.yml`.

**5. Invite Sofiya.** Repo → Settings → Collaborators → add her GitHub username
with **Write** access. She accepts the emailed invite once, and that's the last
time she sees GitHub.

## Finish the form setup

The forms POST directly to [Web3Forms](https://web3forms.com) — no backend, no
serverless function. Free tier is 250 submissions/month; the site gets nowhere
near that.

1. Get an access key at https://web3forms.com (enter `hello@silkandvelvetevents.com`
   as the destination).
2. Add `PUBLIC_WEB3FORMS_KEY` to the AgentOS vault entry for
   `silk-and-velvet-website`, then re-run `mise-env-pull silk-and-velvet-website`.
3. Add the same variable in Vercel → Project Settings → Environment Variables,
   for all environments, then redeploy.
4. In the Web3Forms dashboard, restrict submissions to the
   `silkandvelvetevents.com` domain.

Until the key is set the submit buttons render disabled with a "form is being
set up" note, rather than silently dropping inquiries.

`PUBLIC_FORMSPREE_PROJECT_ID` and `FORMSPREE_DEPLOY_KEY` are now dead vault
entries and can be deleted.

## The one rule when editing config.yml

**Sveltia rewrites a whole file from the fields declared in `config.yml`. Any
key you don't declare gets silently deleted on the next save.**

So if you add a key to any JSON file under `src/data/`, you must also add a
matching field to `public/admin/config.yml`. There's a guard for this:

```bash
npm run check:cms
```

It fails with the exact offending path. Run it after touching either side.

## Local development

```bash
npm run dev
```

Then open http://localhost:4321/admin/ in **Chrome** and click *Work with Local
Repository* — it reads and writes your working copy directly through the File
System Access API, no OAuth needed. Good for testing config changes before
pushing them.

## Adding a new editable field

1. Add the key (with its current value) to the relevant file in `src/data/`.
2. Add a matching field to `public/admin/config.yml` — use a plain-English
   `label`, and a `hint` if the meaning isn't obvious to a non-developer.
3. Read it in the `.astro` file.
4. `npm run check:cms && npm run check && npm run build`.

## Things deliberately left out of the CMS

The privacy policy text, form field labels, nav links, quote-form chip options,
process-strip pill labels and all accessibility strings stay in code. They're
not things Sofiya will ever want to change, and every field added to the CMS is
one more she has to scroll past to reach the ones she does use.

Service entries expose only `seo.title` and `seo.description`. If you ever
hand-add `seo.ogImage` or `seo.canonical` to a markdown file, declare them in
`config.yml` too — see the rule above.
