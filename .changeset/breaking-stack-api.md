---
'svelte-selfheal': minor
---

# 0.3.0 — layer / run / stack

Breaking under 0.x semver. `guard` is gone; heal layers with `run` and `stack` own fetch, slug compare, and redirect.

## Removed

- `guard`, `resolveGuard`
- Demo `db` from the published package

## Changed

- `canonicalRedirect(segments[], searchParams?)` — absolute path from heal segments + static literals
- Svelte 5 peer required
- Defaults split into `defaults/{slug-sanitizers,route-comparators,identifier-handlers}/`

## Added

- `layer()`, `run()`, `stack()` with typed `StackResult`
- `SnakeSlugSanitizer`, `PassthroughSlugSanitizer`, `CaseInsensitiveComparator`, `UnderscoreIdentifierHandler`, `TildeIdentifierHandler`
- Demo site at selfheal.js.org; `examples/` route layouts

## Migration

See [CHANGELOG.md](../CHANGELOG.md#migration).
