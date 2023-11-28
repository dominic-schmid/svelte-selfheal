import { selfheal } from './index.js';

export const healer = selfheal();

/**
 * Sanitizes the slug and joins it with the identifier
 * @param slug The slug to sanitize and join with the identifier
 * @param identifier The actual resource identifier
 * @returns A new slug with the identifier appended in the way you specified in the selfheal configuration
 */
// export function join(slug: string, identifier: string | number): string {
// 	const sanitizedSlug = healer.sanitize(slug);
// 	return healer.identifier.join(sanitizedSlug, identifier);
// }
