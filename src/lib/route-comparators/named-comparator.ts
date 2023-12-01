import type { RouteComparator } from '$lib/types/index.js';

/**
 * Implementation of the `RouteComparator` interface that simply compares both arguments using strict equality `===`
 *
 * @param expected The expected value as generated from the database sanitization
 * @param actual The actual slug value from the url
 * @returns `true` if the values are equal **as specified by the implementation**, `false` if they are unequal
 */
export const NamedComparator: RouteComparator = (expected, actual) => {
	return expected === actual;
};
