/** Parses the stable identifier from a route param value. */
export type UrlIdParser = (slug: string) => string;

/**
 * Builds the canonical route param for a resource.
 * @param identifier Stable resource identifier — passed first intentionally so lookup id stays explicit
 * @param slug Raw slug source (e.g. title) — sanitized internally before joining
 * @param searchParams Optional query string appended to the canonical URL
 */
export type UrlCreator = (
  identifier: string | number,
  slug: string,
  searchParams?: URLSearchParams
) => string;

/**
 * Compares the canonical URL to the current route param.
 *
 * @param expectedUrl Full canonical value from {@link UrlCreator} (may include `?query`)
 * @param actualRoute Raw route param only (e.g. `params.id`) — **without** query string
 * @param params Query params appended to `actualRoute` before comparison
 */
export type UrlValidator = (
  expectedUrl: string,
  actualRoute: string,
  params?: URLSearchParams
) => boolean;
