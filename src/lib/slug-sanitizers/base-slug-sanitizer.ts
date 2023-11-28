import type { SlugSanitizer } from '$lib/types/index.js';

/**
 * Makes the string lowercase, removes all characters except a-z, 0-9, hyphen, underscore and space
 * @param slug The slug to sanitize
 * @returns The sanitized slug
 */
export const BaseSlugSanitizer: SlugSanitizer = (slug) => {
	return slug
		.trim()
		.replace(/[^a-z0-9-_ ]/, '')
		.toLowerCase();
};
