import type { Rerouter } from '$lib/types/index.js';
import { redirect } from '@sveltejs/kit';

/**
 * Implementation of the Redirecter interface that simply compares both arguments using strict equality `===` and
 * *throws a redirect* if the values don't match, redirecting to the expected value.
 *
 * @param expected The expected value as generated from the database sanitization
 * @param actual The actual slug value from the url
 * @returns The new slug if the expected and actual values are not equal, otherwise null
 */
export const NamedRerouter: Rerouter = (expected, actual) => {
	// TODO get url.searchParams and return the new route with the same searchparams as before
	if (expected !== actual) {
		throw redirect(301, expected);
	}
};
