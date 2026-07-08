# svelte-selfheal

Self-healing URLs for SvelteKit. Your pages live at pretty, SEO-friendly paths like
`/blog/my-fancy-title-5312`, but the only part that actually matters is the ID at the
end. If a visitor lands on a wrong, missing, or mangled slug, the library redirects
them to the canonical path with a `301` — as long as the ID is still there.

Inspired by [Aaron Francis](https://www.youtube.com/watch?v=a6lnfyES-LA) and
[Laravel self-healing URLs](https://github.com/lukeraymonddowning/self-healing-urls).

![svelte-selfheal-gif](./static/svelte-selfheal.gif)

Canonical: `/blog/my-fancy-title-5312`. All of these redirect to it:

- `/blog/my-fancy-but-spelled-wrong-title-5312`
- `/blog/5312`
- `/blog/-5312`
- `/blog/THIS should NOT be r3alURL   -5312`

## Why

Slugs change. Titles get edited, links get shared with typos, people hand-truncate
URLs. Without self-healing those all 404 or serve stale paths that hurt SEO. With it,
the ID is the source of truth and everything else auto-corrects to one canonical URL.

Zero runtime dependencies. Peer-depends on Svelte 5 only, and never imports SvelteKit
— you keep calling `error()` and `redirect()` yourself.

## Install

```bash
pnpm add svelte-selfheal
```

## Use

Define a healer and a reusable layer once (e.g. `$lib/healer.ts`):

```ts
import { selfheal } from 'svelte-selfheal';
import { getArticle } from '$lib/db.js';
import type { Article } from '$lib/db.js';

export const healer = selfheal();

export const healArticle = healer.layer<Article>({
  fetch: getArticle,
  segment: (article) => ({ identifier: article.id, slug: article.title })
});
```

Single segment (`/[id]`) — `run` fetches, decides, and returns typed data:

```ts
import { healArticle, healer } from '$lib/healer.js';
import { error, redirect } from '@sveltejs/kit';

export const load = async ({ params, url }) => {
  const result = await healer.run(healArticle(params.id), url.searchParams);
  if (result.notFound) error(404, 'Article not found');
  if (result.redirect) redirect(301, result.redirect);

  const [article] = result.resources;
  return { article };
};
```

Nested segments (`/[id]/details/[innerId]`) — `stack` heals every layer in one
redirect, wrong parent slug included:

```ts
import { healArticle, healer } from '$lib/healer.js';
import { error, redirect } from '@sveltejs/kit';

export const load = async ({ params, url }) => {
  const result = await healer.stack(
    [healArticle(params.id), 'details', healArticle(params.innerId)],
    url.searchParams
  );
  if (result.notFound) error(404, 'Article not found');
  if (result.redirect) redirect(301, result.redirect);

  const [, article] = result.resources;
  return { article };
};
```

## What it supports

- Missing, wrong, or messy slugs → `301` to canonical, as long as the ID survives.
- Nested routes: every heal layer corrects its own segment; static strings like
  `'details'` are path glue and stay untouched.
- Search params are preserved across redirects.
- No match → `notFound`, so you decide the `404`.

Not supported out of the box: IDs that contain the separator character (`-` by
default, e.g. hyphenated UUIDs). Swap in a custom identifier handler for those.

## Extend

Override any strategy; omitted keys keep the defaults. Example using `_` instead of
`-` as the separator (works for UUIDs):

```ts
export const healer = selfheal({
  identifier: {
    join: (slug, id) => `${slug}_${id}`,
    separate: (param) => {
      const i = param.lastIndexOf('_');
      return i === -1
        ? { identifier: param, slug: '' }
        : { identifier: param.slice(i + 1), slug: param.slice(0, i) };
    }
  }
});
```

| Default      | Behavior                                                         |
| ------------ | ---------------------------------------------------------------- |
| `sanitize`   | `KebabSlugSanitizer` — kebab-case, diacritic folding, trims junk |
| `isEqual`    | `NamedComparator` — strict `===` on canonical vs actual          |
| `identifier` | `HyphenIdentifierHandler` — `slug-id` join/split                 |

## Run locally

Demo site and publishable library live in one repo:

```bash
pnpm install
pnpm dev      # demo site
pnpm test
pnpm check
pnpm build    # build demo (Vercel)
pnpm package  # build npm package
```

Working routes to copy from: [`src/routes/[id]/+page.server.ts`](src/routes/[id]/+page.server.ts)
and [`src/routes/[id]/details/[innerId]/+page.server.ts`](src/routes/[id]/details/[innerId]/+page.server.ts).

## License

[MIT](https://github.com/dominic-schmid/svelte-selfheal/blob/main/LICENSE.md)
