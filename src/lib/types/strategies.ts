/** Sanitizes a raw slug source (e.g. article title) into a URL-safe segment. */
export type SlugSanitizer = (slug: string) => string;

/**
 * Joins and separates sanitized slugs from stable resource identifiers.
 *
 * Invariants for a correct implementation:
 * - `separate(join(slug, id)).identifier` must resolve back to `String(id)`
 * - `join('', id)` must produce a param parseable by `separate` (ID-only URLs)
 * - Identifiers must not contain the separator character used by the handler
 */
export interface IdentifierHandler {
  /**
   * Joins a sanitized slug with its identifier.
   * @param slug Sanitized slug segment; pass `''` for ID-only URLs
   * @param identifier Stable resource identifier (id, uuid, etc.)
   */
  join: (slug: string, identifier: string | number) => string;
  /**
   * Separates the identifier from a route param value.
   * @param slug Full route param (e.g. `my-article-123`)
   * @returns `slug` may be empty when the request used an ID-only URL
   */
  separate: (slug: string) => { identifier: string; slug: string };
}

export type RouteComparator = (expectedValue: string, actualValue: string) => boolean;

export interface SelfhealerConfig {
  sanitize: SlugSanitizer;
  /** Canonical vs incoming param; defaults to strict `===`. */
  isEqual: RouteComparator;
  identifier: IdentifierHandler;
}

/** Optional overrides passed to {@link selfheal}; omitted keys use library defaults. */
export type SelfhealerOptions = Partial<SelfhealerConfig>;
