export type SlugSanitizer = (
	slug: string
	/*
	TODO add interface for options so implementations can specify their own options
	options?: Record<string, unknown>
	*/
) => string;

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
	 * @returns An object containing the `identifier` and the slug, which **may be empty** if only the ID was used during the request!
	 */
	separate: (slug: string) => { identifier: string; slug: string };
};

export type UrlIdParser = (slug: string) => string;

export type UrlCreator = (
	identifier: string | number,
	slug: string,
	searchParams?: URLSearchParams
) => string;

export type UrlValidator = (
	expectedUrl: string,
	actualRoute: string,
	params?: URLSearchParams
) => boolean;

export type RouteComparator = (expectedValue: string, actualValue: string) => boolean;

export type SelfhealerConfig = {
	/**
	 * Given the desired URL slug (e.g. an article title), returns a usable sanitized string for the URL
	 */
	sanitize: SlugSanitizer;
	/**
	 * Given the expected and actual routes, returns `true` if the arguments are equal, `false` otherwise
	 */
	isEqual: RouteComparator;
	/**
	 * Handles joining and separating slugs with/from the actual identifiers
	 */
	identifier: IdentifierHandler;
};

export type Selfhealer = {
	/**
	 * Parse the identifier from the *current* route parameter
	 * @param slug The ID coming from the `params` object in the load function
	 * @returns The identifier to use for the database lookup
	 */
	parseId: UrlIdParser;
	/**
	 * Checks if the expected url matches the actual url using the `RedirectChecker` specified during initialization
	 * @param expectedUrl The expected canonical URL
	 * @param actualRoute The actual *route* (not the full url) the user is on
	 * @param params The search params to append to the current route so it can be compared to the canonical URL, if any
	 * @returns `true` if the values are equal **as specified by the implementation**, `false` if they are unequal
	 */
	validate: UrlValidator;
	/**
	 * Sanitizes the slug and joins it with the identifier
	 * @param slug	The slug to sanitize and join with the identifier
	 * @param identifier The actual resource identifier
	 * @param searchParams The search params to append to the url, if any
	 * @returns	A new slug with the identifier appended in the way you specified in the selfheal configuration
	 */
	createUrl: UrlCreator;
};
