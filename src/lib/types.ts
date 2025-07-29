/**
 * Function that cleans text to make it URL-friendly
 * @param input - The text to sanitize
 * @returns The sanitized text suitable for URLs
 */
export type SanitizerFn = (input: string) => string;

/**
 * The order of the ID and slug in the URL
 */
export type IdPlacement = 'id-first' | 'id-last';

/**
 * Function that handles joining and separating slugs with IDs
 */
export interface SeparatorFn {
	/**
	 * Joins a slug with an ID to create a combined URL segment
	 * @param slug - The URL-friendly text
	 * @param id - The identifier (already URL-encoded by the library)
	 * @returns The combined URL segment
	 */
	join(slug: string, id: string): string;

	/**
	 * Separates a combined URL segment back into slug and ID
	 * @param combined - The combined URL segment
	 * @returns Object containing the separated slug and id (id will be URL-decoded by the library)
	 */
	separate(combined: string): { slug: string; id: string };
}

/**
 * Configuration for common character replacements
 * All replacements are enabled by default, set to false to disable
 */
export interface ReplacementConfig {
	/** Replace dots (.) with hyphens (-). Default: true */
	replaceDots?: boolean;
	/** Replace ampersands (&) with "and". Default: true */
	replaceAmpersands?: boolean;
	/** Replace at symbols (@) with "at". Default: true */
	replaceAtSigns?: boolean;
	/** Replace plus signs (+) with "plus". Default: true */
	replacePlus?: boolean;
	/** Replace underscores (_) with hyphens (-). Default: true */
	replaceUnderscores?: boolean;
	/** Replace spaces with hyphens. Default: true */
	replaceSpaces?: boolean;
	/** Custom replacements: { from: to } */
	customReplacements?: Record<string, string>;
}

/**
 * Configuration options for the Healer class
 */
export interface HealerConfig {
	/** Function to sanitize text for URLs. Defaults to unicode sanitizer */
	sanitizer?: SanitizerFn;
	/** Function to handle joining/separating slugs and IDs. Defaults to dot separator */
	separator?: string | SeparatorFn;
	/** URL structure order. Defaults to 'id-first' (id.slug) */
	order?: IdPlacement;
	/** Character replacement configuration */
	replacements?: ReplacementConfig;
}

/**
 * Configuration for TypedHealer with custom ID encoding/decoding
 */
export interface TypedHealerConfig<TId> extends HealerConfig {
	/** Function to encode custom ID type to string */
	idEncoder: (id: TId) => string;
	/** Function to decode string back to custom ID type */
	idDecoder: (encoded: string) => TId;
}
