/**
 * Safely URL-encodes an ID, handling all special characters
 * @param id - The ID to encode
 * @returns The URL-encoded ID
 */
export function encodeId(id: string): string {
	return encodeURIComponent(id);
}

/**
 * Safely URL-decodes an ID back to its original form
 * @param encodedId - The URL-encoded ID
 * @returns The decoded ID
 */
export function decodeId(encodedId: string): string {
	try {
		return decodeURIComponent(encodedId);
	} catch {
		// If decoding fails, return the original string
		return encodedId;
	}
}

/**
 * Normalizes unicode text and removes diacritics (accents)
 * @param text - The text to normalize
 * @returns The normalized text without diacritics
 */
export function normalizeUnicode(text: string): string {
	return text.normalize('NFD').replace(/[\u0300-\u036f]/g, ''); // Remove diacritics
}

/**
 * Removes multiple consecutive hyphens and trims leading/trailing hyphens
 * @param text - The text to condense
 * @returns The condensed text
 */
export function condenseHyphens(text: string): string {
	return text
		.replace(/-{2,}/g, '-') // Replace multiple hyphens with single hyphen
		.replace(/^-+|-+$/g, ''); // Remove leading and trailing hyphens
}
