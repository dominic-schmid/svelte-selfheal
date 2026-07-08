/**
 * A dynamic path segment to heal against its resolved resource.
 *
 * Its `param` is compared to the canonical URL built from `identifier` + `slug`;
 * a mismatch triggers a redirect for the whole path.
 */
export interface HealSegment {
  /** The raw route param exactly as received (e.g. `params.id`) */
  param: string;
  /** The resolved resource's stable identifier (id, uuid, etc.) */
  identifier: string | number;
  /** The resource's canonical slug source (e.g. its title) */
  slug: string;
}

/**
 * One segment of a canonical path.
 *
 * - A plain `string` is a static/literal segment (e.g. `'blog'`, `'details'`) and is never healed.
 * - A {@link HealSegment} is healed against its resolved resource.
 *
 * Prefer {@link Stack} with {@link HealLayer}s when segments need async fetch + heal.
 */
export type PathSegment = string | HealSegment;

/**
 * Sync path composition when you already have resolved resources. For async
 * fetch + heal per segment, use {@link Selfhealer.stack} instead.
 */
export type CanonicalRedirect = (
  segments: readonly PathSegment[],
  searchParams?: URLSearchParams
) => string | null;
