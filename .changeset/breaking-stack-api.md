---
"svelte-selfheal": minor
---

# 0.3.0 — layer / run / stack API

Breaking release under 0.x semver. Replaces guard-based load helpers with a composable heal-layer model.

## Removed

- `guard`, `resolveGuard`
- Publishing demo `db` from `$lib`

## Changed

- `canonicalRedirect(segments[], searchParams?)` — composes absolute paths from heal segments + static literals
- Svelte 5 peer dependency required
- Internal defaults split into `defaults/{slug-sanitizers,route-comparators,identifier-handlers}/`

## Added

- `layer()`, `run()`, `stack()` with typed `StackResult`
- `SnakeSlugSanitizer`, `PassthroughSlugSanitizer`, `CaseInsensitiveComparator`, `UnderscoreIdentifierHandler`, `TildeIdentifierHandler`

## Migration

See [CHANGELOG.md](../CHANGELOG.md#migration).
