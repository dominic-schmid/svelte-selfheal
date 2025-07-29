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
