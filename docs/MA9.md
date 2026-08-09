# Manna MA9 landing contract

This repository implements MA9 from Manna's `docs/GLOBAL_EXPANSION_PLAN.md`.
The coordinated all-language release was owner-approved for deployment on
2026-08-09.

## Publication allowlist

The only indexable locale routes are:

- `/manna/en/`
- `/manna/es/`
- `/manna/pt-BR/`
- `/manna/fr/`
- `/manna/de/`
- `/manna/it/`
- `/manna/pl/`
- `/manna/id/`

The root `/manna/` is the `x-default` entry page. It renders English for people
and link previews, but is `noindex` with canonical `/manna/en/` to avoid a
duplicate English search result. Filipino is not in this allowlist because the
MA1 decision treats it as a metadata/hybrid market rather than a full app
locale.

## Legal-language fallback

The owner-approved MA6 policy is preserved exactly:

| Landing locale | Privacy and terms language |
| --- | --- |
| `es` | Existing Spanish documents |
| `en`, `pt-BR`, `fr`, `de`, `it`, `pl`, `id` | Existing English documents |

Every page labels the legal links in the page language and states when the
linked documents are English. The routes are controlled by
`src/publication.json`; the generator refuses to emit a locale directory
outside that allowlist.

## Source and build

`npm run import:content` imports the exact owner-approved MA7 copy payload and
the final MA6 UI terminology into `src/content.json`, recording source hashes.
`npm run build:assets` produces the favicons, optimized localized screenshots,
and one localized 1200×630 social card per published route. `npm run build`
writes the x-default page, eight locale pages, sitemap, robots, and `.nojekyll`.
`npm run validate` checks routes, canonical/hreflang parity, metadata,
MobileApplication schema, Safari banner, social previews, legal fallback,
assets, alt text, store links, sitemap scope, responsive source contracts, and
the approved source/review hashes.

Each route's Open Graph image contains a screenshot in that route's language
and is suitable for WhatsApp, iMessage, X, and other link unfurlers. Every
route also has localized Open Graph/Twitter title, description, locale, and alt
text. Store buttons use locale-aware Apple and Google URLs.
`MobileApplication` JSON-LD includes the app icon, localized screenshots,
supported operating systems, and both real download URLs. It deliberately
omits `offers`, ratings, and reviews: MA7's approved monetization policy
prohibits price framing, and no attributed review source is part of the
publication contract.

The generated `robots.txt` is the Manna-scoped deployment artifact and points
to the one canonical MA9 sitemap. Because robots rules are authoritative only
at an origin root, deployment must merge these directives into
`https://armandojimenez.dev/robots.txt` as part of the coordinated owner-gated
publish; the landing repository does not mutate the live root site.
