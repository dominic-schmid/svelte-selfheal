import type { RouteComparator } from '../../types/strategies.js';

/** Strict string equality comparator for canonical vs actual routes. */
export const NamedComparator: RouteComparator = (expected, actual) => expected === actual;
