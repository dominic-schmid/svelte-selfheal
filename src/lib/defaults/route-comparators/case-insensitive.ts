import type { RouteComparator } from '../../types/strategies.js';

/**
 * Case-insensitive route comparator — ignores casing differences without redirecting.
 *
 * @example
 * CaseInsensitiveComparator('My-Post-1', 'my-post-1') // true
 */
export const CaseInsensitiveComparator: RouteComparator = (expected, actual) =>
  expected.toLowerCase() === actual.toLowerCase();
