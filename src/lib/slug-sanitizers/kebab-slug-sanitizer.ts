import type { SlugSanitizer } from '$lib/types/index.js';

/**
 * Replaces spaces with hyphens, removes multiple hyphens, removes hyphens at the start and end of the string
 * @param slug The slug to sanitize
 * @returns The sanitized slug
 */
export const KebabSlugSanitizer: SlugSanitizer = (slug) => {
	const options = { condense: true }; // TODO make this passable through dynamic params
	return slug
		.trim()
		.replace(/([a-z])([A-Z])/g, '$1-$2')
		.replace(/\W/g, (m) => (/[À-ž]/.test(m) ? m : '-'))
		.replace(/^-+|-+$/g, '')
		.replace(/-{2,}/g, (m) => (options && options.condense ? '-' : m))
		.toLowerCase();
};
