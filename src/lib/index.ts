import { HyphenIdentifierHandler } from './identifier-handlers/hyphen-identifier-handler.js';
import { NamedRerouter } from './rerouters/named-rerouter.js';
import { KebabSlugSanitizer } from './slug-sanitizers/kebab-slug-sanitizer.js';
import type { Selfhealer } from './types/index.js';

/**
 *
 */

/**
 * Returns a `Selfhealer` with the default configuration
 * - `slugSanitizer`: `KebabSlugSanitizer`
 * - `rerouter`: `NamedRerouter`
 * - `identifierHandler`: `HyphenIdentifierHandler`
 * @param params Optional parameters to override the default configuration
 * @returns An object containing the required functions to handle url self-healing
 */
export const selfheal = (params?: Partial<Selfhealer>): Selfhealer => {
	return {
		slugSanitizer: params?.slugSanitizer ?? KebabSlugSanitizer,
		shouldRedirect: params?.shouldRedirect ?? NamedRerouter,
		identifierHandler: params?.identifierHandler ?? HyphenIdentifierHandler
	};
};
