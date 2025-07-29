import type { SeparatorFn, IdPlacement } from './types.js';

/**
 * Creates a separator function for any character or string
 * @param separator - The character or string to use as separator
 * @returns A SeparatorFn that uses the specified separator
 * @example
 * ```typescript
 * const pipeSeparator = createSeparator('|');
 * pipeSeparator.join('my-slug', '123'); // → "my-slug|123"
 * ```
 */
export function createSeparator(separator: string): SeparatorFn {
	return {
		join: (slug: string, id: string, order: IdPlacement): string => {
			if (!slug) return id;
			return order === 'id-first' ? `${id}${separator}${slug}` : `${slug}${separator}${id}`;
		},

		separate: (combined: string, order: IdPlacement): { slug: string; id: string } => {
			const lastSeparatorIndex = combined.lastIndexOf(separator);

			// No separators found - just return the ID
			if (lastSeparatorIndex === -1) {
				return { slug: '', id: combined };
			}

			const first = combined.substring(0, lastSeparatorIndex);
			const second = combined.substring(lastSeparatorIndex + separator.length);

			return order === 'id-first' ? { slug: second, id: first } : { slug: first, id: second };
		}
	};
}

/**
 * Creates a length-prefixed separator that guarantees no conflicts
 * Uses format: length-id-slug (when id-first) or length-slug-id (when id-last)
 * This approach is 100% reliable regardless of what characters appear in the content
 * @param separator - The character to use as separator (required)
 * @returns A SeparatorFn that uses length-prefixed parsing
 */
export function createLengthPrefixedSeparator(separator: string): SeparatorFn {
	// Create a regular separator for clean fallback
	const regularSeparator = createSeparator(separator);

	return {
		join: (slug: string, id: string, order: IdPlacement): string => {
			if (!slug) return id;

			// Always use length-prefixed format when creating URLs
			const [first, second] = order === 'id-first' ? [id, slug] : [slug, id];
			return `${first.length}${separator}${first}${separator}${second}`;
		},

		separate: (combined: string, order: IdPlacement): { slug: string; id: string } => {
			// Quick check: no separators = just ID
			if (!combined.includes(separator)) {
				return { slug: '', id: combined };
			}

			// Try to parse as length-prefixed format first
			const firstSepIndex = combined.indexOf(separator);
			const lengthStr = combined.substring(0, firstSepIndex);
			const length = parseInt(lengthStr, 10);

			// Valid length prefix detected
			if (length === length && length >= 0) {
				const contentStart = firstSepIndex + separator.length;
				const contentEnd = contentStart + length;

				// Ensure we have enough content for the specified length
				if (contentEnd <= combined.length) {
					const firstPart = combined.substring(contentStart, contentEnd);

					// Check if there's a second separator at the expected position
					const secondSepStart = contentEnd;
					if (
						secondSepStart < combined.length &&
						combined.substring(secondSepStart, secondSepStart + separator.length) === separator
					) {
						// Full format: "length-first-second"
						const secondPart = combined.substring(secondSepStart + separator.length);
						return order === 'id-first'
							? { slug: secondPart, id: firstPart }
							: { slug: firstPart, id: secondPart };
					}
					// Partial formats like "3-abc" should fall back to regular separator
				}
			}

			// Not a valid length-prefixed format - delegate to regular separator
			return regularSeparator.separate(combined, order);
		}
	};
}

/**
 * Underscore separator (default) - clean and collision-free
 * Creates URLs like: /article/my-title_123
 * Good for: when dots might conflict with your routing
 */
export const underscore: SeparatorFn = createSeparator('_');

/**
 * Dot separator - alternative clean option
 * Creates URLs like: /article/my-title.123
 * Works with: UUIDs, numeric IDs, most string IDs
 * Why dot as default? Clean, URL-safe, doesn't appear in UUIDs, easy to parse
 */
export const dot: SeparatorFn = createSeparator('.');

/**
 * Tilde separator - for special cases
 * Creates URLs like: /article/my-title~123
 * Good for: when both dots and underscores are used elsewhere
 */
export const tilde: SeparatorFn = createSeparator('~');

/**
 * Collection of built-in separator functions
 */
export const separators = {
	underscore,
	dot,
	tilde
} as const;
