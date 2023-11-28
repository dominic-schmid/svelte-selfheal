import type { RedirectChecker } from '$lib/types/index.js';

/**
 * Implementation of the Redirecter interface that simply compares both arguments using strict equality `===`
 *
 * @param expected The expected value as generated from the database sanitization
 * @param actual The actual slug value from the url
 * @returns The new slug if the expected and actual values are not equal, otherwise null
 */
export const NamedChecker: RedirectChecker = (expected, actual) => {
	// TODO get url.searchParams and return the new route with the same searchparams as before
	return expected !== actual;
};
