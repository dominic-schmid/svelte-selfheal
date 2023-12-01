import { HyphenIdentifierHandler } from './identifier-handlers/hyphen-identifier-handler.js';
import { NamedComparator } from './route-comparators/named-comparator.js';
import { KebabSlugSanitizer } from './slug-sanitizers/kebab-slug-sanitizer.js';
import type {
	Selfhealer,
	SelfhealerConfig,
	UrlCreator,
	UrlIdParser,
	UrlValidator
} from './types/index.js';

/**
 * Returns a `Selfhealer` with the default configuration
 * - slugSanitizer: `KebabSlugSanitizer`
 * - comparator: `NamedComparator`
 * - identifierHandler: `HyphenIdentifierHandler`
 * @param params Parameters to override the default configuration
 * @returns An object containing the required functions to handle URL self-healing
 */
export const selfheal = (params?: SelfhealerConfig): Selfhealer => {
	const healer: SelfhealerConfig = {
		sanitize: params?.sanitize ?? KebabSlugSanitizer,
		isEqual: params?.isEqual ?? NamedComparator,
		identifier: params?.identifier ?? HyphenIdentifierHandler
	};

	const createUrl: UrlCreator = (identifier, slug, params) => {
		let redirectUrl = healer.identifier.join(healer.sanitize(slug), identifier);

		if (params && params.size > 0) redirectUrl += `?${params.toString()}`;

		return redirectUrl;
	};

	const parseId: UrlIdParser = (slug) => {
		return healer.identifier.separate(slug).identifier;
	};

	const validate: UrlValidator = (expectedUrl, actualRoute, params) => {
		if (params && params.size > 0) actualRoute += `?${params.toString()}`;
		return healer.isEqual(expectedUrl, actualRoute);
	};

	return {
		parseId,
		createUrl,
		validate
	};
};
