# Changelog

All notable changes to this project are documented here.

Format based on [Keep a Changelog](https://keepachangelog.com/). Versioning follows [SemVer](https://semver.org/).

## [0.3.0] - 2026-07-09

### Breaking

- **API:** Removed `guard` / `resolveGuard`. Use `run`, `stack`, or `canonicalRedirect` instead.
- **API:** `canonicalRedirect` now takes an ordered segment array and returns an absolute path (or `null`), not a bare param string.
- **API:** Added `layer`, `run`, and `stack` as the primary async flow. Each layer owns fetch + heal; `stack` heals every segment (including parent slugs on nested routes).
- **API:** `stack` / `run` return a discriminated `StackResult` (`{ notFound: true }` | `{ notFound: false, redirect, resources }`) instead of `null` on fetch failure.
- **Exports:** Demo `db` removed from the published package (`src/demo/` only). Consumers must supply their own fetch functions via `layer`.
- **Exports:** Strategy modules reorganized under `defaults/` (same public names, new paths internally).
- **Peer dependency:** Svelte `^5.0.0` required (was Svelte 4–compatible).

### Added

- `layer()` — reusable heal-layer factory (fetch + segment mapping).
- `run()` — single-segment sugar over `stack`.
- `stack()` — compose heal layers and static path segments with typed `resources`.
- `SelfhealerOptions` — partial config (`Partial<SelfhealerConfig>`).
- Default strategies: `SnakeSlugSanitizer`, `PassthroughSlugSanitizer`, `CaseInsensitiveComparator`, `UnderscoreIdentifierHandler`, `TildeIdentifierHandler`.
- Behavior-focused test suite; demo migrated to Svelte 5 runes.

### Changed

- Zero runtime dependencies (Svelte 5 peer only).
- Tooling: ESLint flat config, stricter TypeScript, 2-space Prettier, pnpm-only.
- README rewritten for the layer/run/stack model.

### Migration

**Before (0.2.x-style load):**

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

See git history before the `feat!: restructure lib with layer/run/stack API and Svelte 5 demo` commit.
