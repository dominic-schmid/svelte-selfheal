import type { HealerConfig, TypedHealerConfig } from './types.js';
import { encodeId, decodeId } from './utils.js';
import { unicode } from './sanitizers.js';
import { dot } from './separators.js';
import { createReplacementSanitizer } from './replacements.js';
import { redirect } from '@sveltejs/kit';

/**
 * Main Healer class for generating SEO-friendly URLs with IDs
 * Works perfectly with zero configuration using smart defaults
 */
export class Healer {
	private readonly sanitizer;
	private readonly separator;
	private readonly order;

	/**
	 * Creates a new Healer instance
	 * @param config - Optional configuration object. Defaults provide collision-free, URL-safe behavior
	 */
	constructor(config: HealerConfig = {}) {
		const baseSanitizer = config.sanitizer ?? unicode;

		// If replacements are configured, apply them before the sanitizer
		if (config.replacements) {
			this.sanitizer = createReplacementSanitizer(config.replacements, baseSanitizer);
		} else {
			this.sanitizer = baseSanitizer;
		}

		this.separator = config.separator ?? dot;
		this.order = config.order ?? 'default';
	}

	/**
	 * Creates a clean, SEO-friendly URL from an ID and slug text
	 * Automatically handles URL encoding and applies configured sanitization
	 * @param id - The unique identifier (any string, will be URL-encoded)
	 * @param slug - The human-readable text (will be sanitized)
	 * @param searchParams - Optional URL search parameters to append
	 * @returns A URL-safe string ready for use in routes
	 * @example
	 * ```typescript
	 * const healer = new Healer();
	 * healer.createUrl('123', 'My Article Title'); // → "my-article-title.123"
	 * healer.createUrl('user:123/org:456', 'Dashboard'); // → "dashboard.user%3A123%2Forg%3A456"
	 * ```
	 */
	createUrl(id: string | number, slug: string, searchParams?: URLSearchParams): string {
		const sanitizedSlug = this.sanitizer(slug);
		const encodedId = encodeId(id.toString());

		// Apply the configured order (default: slug.id, reversed: id.slug)
		const combined =
			this.order === 'reversed'
				? this.separator.join(encodedId, sanitizedSlug)
				: this.separator.join(sanitizedSlug, encodedId);

		// Add search parameters if provided
		if (searchParams && searchParams.size > 0) {
			return `${combined}?${searchParams.toString()}`;
		}

		return combined;
	}

	/**
	 * Extracts the original ID from a URL slug
	 * Automatically handles URL decoding
	 * @param combined - The combined URL segment (slug + ID)
	 * @returns The original ID, decoded from the URL
	 * @example
	 * ```typescript
	 * const healer = new Healer();
	 * healer.parseId('my-article-title.123'); // → "123"
	 * healer.parseId('dashboard.user%3A123%2Forg%3A456'); // → "user:123/org:456"
	 * ```
	 */
	parseId(combined: string): string {
		const { slug, id } = this.separator.separate(combined);

		// In reversed order, the "slug" is actually the ID and vice versa
		const encodedId = this.order === 'reversed' ? slug : id;
		return decodeId(encodedId);
	}

	/**
	 * Validates that a URL matches the expected canonical form
	 * Always performs exact matching for reliable, predictable behavior
	 * @param expected - The expected canonical URL
	 * @param actual - The actual URL to validate
	 * @returns True if URLs match exactly, false otherwise
	 * @example
	 * ```typescript
	 * const healer = new Healer();
	 * const expected = healer.createUrl('123', 'My Article');
	 * healer.validate(expected, 'my-article.123'); // → true
	 * healer.validate(expected, 'old-title.123'); // → false
	 * ```
	 */
	validate(expected: string, actual: string): boolean {
		return expected === actual;
	}

	/**
	 * Validates a URL and throws a redirect if it doesn't match the expected canonical form
	 * Convenience method that combines validate() with automatic redirecting
	 * @param expected - The expected canonical URL
	 * @param actual - The actual URL to validate
	 * @throws {Redirect} 301 redirect to the expected URL if validation fails
	 * @example
	 * ```typescript
	 * const healer = new Healer();
	 * const expectedUrl = healer.createUrl(article.id, article.title);
	 * healer.validateOrRedirect(expectedUrl, params.slug); // Redirects if needed
	 * ```
	 */
	validateOrRedirect(expected: string, actual: string): void {
		if (!this.validate(expected, actual)) {
			throw redirect(301, expected);
		}
	}

	/**
	 * Validates the current URL slug and redirects if it doesn't match the canonical form
	 * Clear object-based API that makes parameters and behavior obvious
	 * @param options - Validation options
	 * @param options.entity - The entity data (id and title/slug source)
	 * @param options.currentSlug - The full slug from URL params (e.g., params.slug)
	 * @param options.searchParams - Optional search parameters to preserve in redirect
	 * @throws {Response} 301 redirect if the current slug doesn't match the canonical form
	 * @example
	 * ```typescript
	 * const id = healer.parseId(params.slug);
	 * const article = await getArticle(id);
	 * healer.validateAndRedirect({
	 *   entity: { id: article.id, title: article.title },
	 *   currentSlug: params.slug,
	 *   searchParams: url.searchParams
	 * });
	 * ```
	 */
	validateAndRedirect(options: {
		entity: { id: string | number; slug: string };
		currentSlug: string;
		searchParams?: URLSearchParams;
	}): void {
		const expectedUrl = this.createUrl(options.entity.id, options.entity.slug);

		// Only compare the slug part (without search params)
		if (expectedUrl !== options.currentSlug) {
			// Create full redirect URL with search params if provided
			const redirectUrl =
				options.searchParams && options.searchParams.size > 0
					? `${expectedUrl}?${options.searchParams.toString()}`
					: expectedUrl;

			throw redirect(301, redirectUrl);
		}
	}

	/**
	 * Safely extracts the original ID from a URL slug without throwing
	 * Returns null only if parsing throws an error (rare due to forgiving separator logic)
	 * @param combined - The combined URL segment (slug + ID)
	 * @returns The original ID, or null if parsing fails
	 * @example
	 * ```typescript
	 * const healer = new Healer();
	 * healer.safeParse('my-article.123'); // → "123"
	 * healer.safeParse('just-an-id'); // → "just-an-id" (treats whole string as ID)
	 * healer.safeParse(''); // → "" (empty ID)
	 * ```
	 */
	safeParse(combined: string): string | null {
		try {
			return this.parseId(combined);
		} catch {
			return null;
		}
	}
}

/**
 * Extended Healer class for custom ID types with encoding/decoding support
 * Useful for complex ID structures like composite keys or custom objects
 */
export class TypedHealer<TId = string> {
	private readonly healer: Healer;
	private readonly idEncoder;
	private readonly idDecoder;

	/**
	 * Creates a new TypedHealer instance with custom ID handling
	 * @param config - Configuration including ID encoder/decoder functions
	 */
	constructor(config: TypedHealerConfig<TId>) {
		this.healer = new Healer(config);
		this.idEncoder = config.idEncoder;
		this.idDecoder = config.idDecoder;
	}

	/**
	 * Creates a URL with a custom ID type
	 * @param id - The typed ID to encode
	 * @param slug - The human-readable text
	 * @param searchParams - Optional URL search parameters
	 * @returns A URL-safe string
	 */
	createUrl(id: TId, slug: string, searchParams?: URLSearchParams): string {
		const encodedId = this.idEncoder(id);
		return this.healer.createUrl(encodedId, slug, searchParams);
	}

	/**
	 * Extracts and decodes a custom ID type from a URL slug
	 * @param combined - The combined URL segment
	 * @returns The original typed ID
	 */
	parseId(combined: string): TId {
		const stringId = this.healer.parseId(combined);
		return this.idDecoder(stringId);
	}

	/**
	 * Validates that a URL matches the expected canonical form
	 * @param expected - The expected canonical URL
	 * @param actual - The actual URL to validate
	 * @returns True if URLs match exactly, false otherwise
	 */
	validate(expected: string, actual: string): boolean {
		return this.healer.validate(expected, actual);
	}

	/**
	 * Validates a URL and throws a redirect if it doesn't match the expected canonical form
	 * @param expected - The expected canonical URL
	 * @param actual - The actual URL to validate
	 * @throws {Redirect} 301 redirect to the expected URL if validation fails
	 */
	validateOrRedirect(expected: string, actual: string): void {
		return this.healer.validateOrRedirect(expected, actual);
	}

	/**
	 * Validates the current URL slug and redirects if it doesn't match the canonical form (with typed IDs)
	 * @param options - Validation options
	 * @param options.entity - The entity data with typed ID
	 * @param options.currentSlug - The full slug from URL params
	 * @param options.searchParams - Optional search parameters to preserve in redirect
	 * @throws {Response} 301 redirect if the current slug doesn't match the canonical form
	 */
	validateAndRedirect(options: {
		entity: { id: TId; title: string };
		currentSlug: string;
		searchParams?: URLSearchParams;
	}): void {
		const encodedId = this.idEncoder(options.entity.id);
		return this.healer.validateAndRedirect({
			entity: { id: encodedId, slug: options.entity.title },
			currentSlug: options.currentSlug,
			searchParams: options.searchParams
		});
	}

	/**
	 * Safely extracts and decodes a custom ID type from a URL slug without throwing
	 * @param combined - The combined URL segment
	 * @returns The original typed ID, or null if parsing fails
	 */
	safeParse(combined: string): TId | null {
		try {
			return this.parseId(combined);
		} catch {
			return null;
		}
	}
}
