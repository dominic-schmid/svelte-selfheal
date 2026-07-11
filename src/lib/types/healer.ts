import type { CanonicalRedirect } from './segment.js';
import type { LayerFactory, Run, Stack } from './layer.js';
import type { UrlCreator, UrlIdParser, UrlValidator } from './primitives.js';

export interface Selfhealer {
  parseId: UrlIdParser;
  validate: UrlValidator;
  createUrl: UrlCreator;
  /** Define a reusable heal layer (fetch + segment mapping). */
  layer: LayerFactory;
  /** Run one heal layer — use on single-segment routes (`/[id]`). */
  run: Run;
  /**
   * Stack heal layers and static segments; each layer fetches and heals its param.
   * Returns `{ notFound: true }` when any layer's fetch fails.
   */
  stack: Stack;
  /**
   * Sync compose when resources are already loaded. For nested routes with async
   * lookups, prefer {@link Selfhealer.stack}.
   */
  canonicalRedirect: CanonicalRedirect;
}
