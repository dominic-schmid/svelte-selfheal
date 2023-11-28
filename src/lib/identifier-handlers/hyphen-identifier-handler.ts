import type { IdentifierHandler } from '$lib/types/index.js';

/**
 * Implementation of the IdentifierHandler interface that uses hyphens to separate the slug from the identifier
 */
export const HyphenIdentifierHandler: IdentifierHandler = {
	join: (slug, identifier) => {
		// Handle edge case so we dont try to redirect to "/-123" which would break the parser
		if (slug === '') return `${identifier}`;
		return `${slug}-${identifier}`;
	},
	separate: (slug) => {
		const [identifier, ...rest] = slug.split('-').reverse();
		return {
			identifier,
			slug: rest.reverse().join('-')
		};
	}
};
