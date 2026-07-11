# Examples

Three route layouts for `svelte-selfheal`. Pick the folder that matches your param shape.

| Folder | API | Route shape |
| ------ | --- | ----------- |
| [single-segment-run](./single-segment-run/) | `healer.run()` | `/[id]` |
| [nested-stack](./nested-stack/) | `healer.stack()` | `/[id]/details/[innerId]` |
| [sync-canonical-redirect](./sync-canonical-redirect/) | `healer.canonicalRedirect()` | data already fetched in `load` |

Each folder is a minimal `src/` tree. Copy files into your app and point `getArticle` / `getAuthor` at your data layer.
