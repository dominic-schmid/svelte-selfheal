import type { SeparatorFn } from './types.js';

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
		join: (slug: string, id: string): string => {
			return slug ? `${slug}${separator}${id}` : id;
		},

		separate: (combined: string): { slug: string; id: string } => {
			const lastSeparatorIndex = combined.lastIndexOf(separator);
			if (lastSeparatorIndex === -1) {
				return { slug: '', id: combined };
			}
			return {
				slug: combined.substring(0, lastSeparatorIndex),
				id: combined.substring(lastSeparatorIndex + separator.length)
			};
		}
	};
}

/**
 * Dot separator (default) - clean and collision-free
 * Creates URLs like: /article/my-title.123
 * Works with: UUIDs, numeric IDs, most string IDs
 * Why dot as default? Clean, URL-safe, doesn't appear in UUIDs, easy to parse
 */
export const dot: SeparatorFn = createSeparator('.');

/**
 * Underscore separator - alternative clean option
 * Creates URLs like: /article/my-title_123
 * Good for: when dots might conflict with your routing
 */
export const underscore: SeparatorFn = createSeparator('_');

/**
 * Tilde separator - for special cases
 * Creates URLs like: /article/my-title~123
 * Good for: when both dots and underscores are used elsewhere
 */
export const tilde: SeparatorFn = createSeparator('~');

/**
 * Collection of built-in separator functions
 * Export as named object for easy access and documentation
 */
export const separators = {
	dot,
	underscore,
	tilde
} as const;
