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
	/**
	 * Joins the slug with the identifier as specified during initialization and returns the new slug
	 * @param slug The slug to join
	 * @param identifier The identifier to join to the slug
	 * @returns The complete url slug
	 */
	join: (slug: string, identifier: string | number) => string;
	/**
	 * Separates the actual identifier from the slug and returns an object containing both
	 * @param slug The slug to separate
	 * @returns An object containing the `identifier` and the slug, which **may be empty**!
	 */
	separate: (slug: string) => { identifier: string | number; slug: string };
};

/**
 * Sanitizes the slug and joins it with the identifier
 * @param slug	The slug to sanitize and join with the identifier
 * @param identifier The actual resource identifier
 * @returns	A new slug with the identifier appended in the way you specified in the selfheal configuration
 */
export type UrlCreator = (slug: string, identifier: string | number) => string;

/**
 * Given the expected and actual url slug, returns the URL the user should be redirected to
 * @returns The url the user should be redirected to, or an empty string if no redirect is needed
 */
export type RedirectChecker = (expectedValue: string, actualValue: string) => boolean;

/**
 * Given the expected and actual url slug, throws a redirect error if the user should be redirected
 * @returns undefined
 */
export type Rerouter = (expectedValue: string, actualValue: string) => void;

/**
 * An object containing the functions to handle url self-healing
 */
export type Selfhealer = {
	/**
	 * Given the desired url slug, returns a usable sanitized version for the url
	 */
	sanitize: SlugSanitizer;
	/**
	 * Given the expected and actual url slug, returns the URL the user should be redirected to
	 */
	shouldRedirect: RedirectChecker;
	/**
	 * Given the expected and actual url slug, throws a redirect error if the user should be redirected
	 */
	reroute: Rerouter;
	/**
	 * Handles joining and separating slugs with/from the actual identifiers
	 */
	identifier: IdentifierHandler;
	/**
	 * Sanitizes the slug and joins it with the identifier
	 */
	create: UrlCreator;
};
