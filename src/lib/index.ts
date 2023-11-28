import { HyphenIdentifierHandler } from './identifier-handlers/hyphen-identifier-handler.js';
import { NamedChecker } from './redirect-checkers/named-checker.js';
import { NamedRerouter } from './rerouters/named-rerouter.js';
import { KebabSlugSanitizer } from './slug-sanitizers/kebab-slug-sanitizer.js';
import type { Selfhealer, UrlCreator } from './types/index.js';

/**
 * Returns a `Selfhealer` with the default configuration
 * - `slugSanitizer`: `KebabSlugSanitizer`
 * - `rerouter`: `NamedRerouter`
 * - `identifierHandler`: `HyphenIdentifierHandler`
 * @param params Optional parameters to override the default configuration
 * @returns An object containing the required functions to handle url self-healing
 */
export const selfheal = (params?: Partial<Omit<Selfhealer, 'create'>>): Selfhealer => {
	const healer: Omit<Selfhealer, 'create'> = {
		sanitize: params?.sanitize ?? KebabSlugSanitizer,
		shouldRedirect: params?.shouldRedirect ?? NamedChecker,
		identifier: params?.identifier ?? HyphenIdentifierHandler,
		reroute: params?.reroute ?? NamedRerouter
	};

	/**
	 * Sanitizes the slug and joins it with the identifier using the configuration specified during initialization
	 * @param slug The slug to sanitize and join with the identifier
	 * @param identifier The actual resource identifier
	 * @returns A new slug with the identifier appended in the way you specified in the selfheal configuration
	 */
	const create: UrlCreator = (slug, identifier) => {
		const sanitizedSlug = healer.sanitize(slug);
		return healer.identifier.join(sanitizedSlug, identifier);
	};

	return {
		create,
		...healer
	};
};
