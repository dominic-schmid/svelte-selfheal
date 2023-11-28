/**
 * Given the desired url slug, returns a usable sanitized version for the url
 */
export type SlugSanitizer = (
	slug: string
	/*
	TODO add interface for options so implementations can specify their own options
	options?: Record<string, unknown>
	*/
) => string;

/**
 * Handles joining and separating slugs with/from the actual identifiers
 */
export type IdentifierHandler = {
	joinToSlug: (slug: string, identifier: string | number) => string;
	separateFromSlug(slug: string): { identifier: string | number; slug: string };
};

/**
 * Given the expected and actual url slug, returns the URL the user should be redirected to
 * @returns The url the user should be redirected to, or null if no redirect is needed
 */
export type Rerouter = (expectedValue: string, actualValue: string) => string | null;

/**
 * An object containing the functions to handle url self-healing
 */
export type Selfhealer = {
	slugSanitizer: SlugSanitizer;
	shouldRedirect: Rerouter;
	identifierHandler: IdentifierHandler;
};
