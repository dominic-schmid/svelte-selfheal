# Sync redirect — `healer.canonicalRedirect()`

Use when the resource is already in memory — parent `load`, shared layout fetch, or cache. Parse the ID yourself, fetch once, then call `canonicalRedirect()` synchronously. No second fetch through a heal layer.

Route: `/[id]` (same shape as `run()`, different data flow)
