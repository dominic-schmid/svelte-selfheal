# Changelog

Format: [Keep a Changelog](https://keepachangelog.com/). Versions: [SemVer](https://semver.org/).

## [0.3.1] - 2026-07-11

### Changed

- README: correct live demo URL; add upgrading guide linking to the migration section below.

## [0.3.0] - 2026-07-09

Heal layers replace `guard`. Define fetch + segment mapping once, call `run` or `stack` in
`load`, get typed resources and a single redirect when the slug drifts. Demo site ships
at [svelte-selfheal.vercel.app](https://svelte-selfheal.vercel.app) with copy-ready `examples/`.

### Breaking

- Removed `guard` / `resolveGuard` — use `run`, `stack`, or `canonicalRedirect`.
- `canonicalRedirect` takes an ordered segment array; returns an absolute path or `null`.
- `layer`, `run`, `stack` are the async entry points. Each layer owns fetch + heal;
  `stack` corrects every segment, including parent slugs on nested routes.
- `run` / `stack` return `StackResult` (`notFound` | `{ redirect, resources }`) instead of `null` on fetch miss.
- Demo `db` is not published (`src/demo/` stays in-repo). Wire your own `fetch` via `layer`.
- Strategy modules live under `defaults/` internally; public export names unchanged.
- Peer dependency: Svelte `^5.0.0` (was Svelte 4–compatible).

### Added

- `layer()`, `run()`, `stack()` with typed `resources`.
- `SelfhealerOptions` (`Partial<SelfhealerConfig>`).
- Strategies: `SnakeSlugSanitizer`, `PassthroughSlugSanitizer`, `CaseInsensitiveComparator`, `UnderscoreIdentifierHandler`, `TildeIdentifierHandler`.
- Prerendered demo: live 301/404 try links, setup code switcher, strategy catalog.
- `examples/` — `single-segment-run`, `nested-stack`, `sync-canonical-redirect`.
- Demo deploys to Vercel (`@sveltejs/adapter-vercel`); `PUBLIC_SITE_URL` for canonical and OG tags.
- `knip` dead-code check; `engines.node` `>=20`.

### Changed

- Zero runtime dependencies (Svelte 5 peer only).
- ESLint flat config, stricter TypeScript, Prettier 2-space; `examples/` excluded from lint/format.
- Demo routes use shared shell and try-link sections; install/setup tabs are `role="tab"` buttons.
- Copy button reads `data-pm` instead of `:has(:checked)` radio CSS.

### Removed

- `docs/` — release notes live in README and this file.

### Migration

**Before (0.1.x):**

```ts
const id = healer.parseId(params.id);
const article = await db.getArticle(id);
if (!article) error(404);

const to = healer.guard({ param: params.id, article, searchParams: url.searchParams });
if (to) redirect(301, to);
```

**After — single segment:**

```ts
const result = await healer.run(healArticle(params.id), url.searchParams);
if (result.notFound) error(404, 'Not found');
if (result.redirect) redirect(301, result.redirect);
return { article: result.resources[0] };
```

**After — nested segments:**

```ts
const result = await healer.stack(
  [healArticle(params.id), 'details', healArticle(params.innerId)],
  url.searchParams
);
if (result.notFound) error(404, 'Not found');
if (result.redirect) redirect(301, result.redirect);
return { article: result.resources[1] };
```

Define `healArticle` once with `healer.layer({ fetch, segment })` and reuse at any depth.

---

## [0.2.x and earlier]

See git history before `feat!: restructure lib with layer/run/stack API and Svelte 5 demo`.
