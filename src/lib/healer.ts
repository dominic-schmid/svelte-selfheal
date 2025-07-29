import type {
	HealerConfig,
	IdPlacement,
	SanitizerFn,
	SeparatorFn,
	TypedHealerConfig
} from './types.js';
import { encodeId, decodeId } from './utils.js';
import { unicode } from './sanitizers.js';
import { createSeparator, underscore } from './separators.js';
import { createReplacementSanitizer } from './replacements.js';
import { redirect } from '@sveltejs/kit';
import { error } from '@sveltejs/kit';

/**
 * Main Healer class for generating SEO-friendly URLs with IDs
 * Works perfectly with zero configuration using smart defaults
 */
export class Healer {
	private readonly sanitizer: SanitizerFn;
	private readonly separator: SeparatorFn;
	private readonly order: IdPlacement;

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

		// Set up separator function
		if (typeof config.separator === 'string') {
			this.separator = createSeparator(config.separator);
		} else {
			this.separator = config.separator ?? underscore;
		}

		this.order = config.order ?? 'id-first';
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

		// Create the combined URL using the separator
		const combined = this.separator.join(sanitizedSlug, encodedId, this.order);

		// Add search parameters if provided
		if (searchParams && searchParams.size > 0) {
			return `${combined}?${searchParams.toString()}`;
		}

		return combined;
	}

	/**
	 * Extracts the original ID from a URL slug
	 * Automatically handles URL decoding
	 * @param slug - The URL slug containing the ID (e.g., "my-article.123")
	 * @returns The original ID, decoded from the URL
	 * @example
	 * ```typescript
	 * const healer = new Healer();
	 * healer.extractId('my-article-title.123'); // → "123"
	 * healer.extractId('dashboard.user%3A123%2Forg%3A456'); // → "user:123/org:456"
	 * ```
	 */
	extractId(slug: string): string {
		const { id } = this.separator.separate(slug, this.order);
		return decodeId(id);
	}

	/**
	 * Checks if a URL slug is in its canonical form
	 * Always performs exact matching for reliable, predictable behavior
	 * @param expectedSlug - The expected canonical URL slug
	 * @param actualSlug - The actual URL slug to check
	 * @returns True if the slug is already canonical, false otherwise
	 * @example
	 * ```typescript
	 * const healer = new Healer();
	 * const expectedSlug = healer.createUrl('123', 'My Article');
	 * healer.isCanonical(expectedSlug, 'my-article.123'); // → true
	 * healer.isCanonical(expectedSlug, 'old-title.123'); // → false
	 * ```
	 */
	isCanonical(expectedSlug: string, actualSlug: string): boolean {
		return expectedSlug === actualSlug;
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
	 * Safely extracts the ID from a URL slug without throwing errors
	 * Returns null if the slug format is invalid or parsing fails
	 * @param slug - The URL slug to extract the ID from
	 * @returns The extracted ID, or null if extraction fails
	 * @example
	 * ```typescript
	 * const healer = new Healer();
	 * healer.tryExtractId('my-article.123'); // → "123"
	 * healer.tryExtractId('malformed-url'); // → null (graceful failure)
	 * healer.tryExtractId(''); // → null (invalid input)
	 * ```
	 */
	tryExtractId(slug: string): string | null {
		try {
			return this.extractId(slug);
		} catch {
			return null;
		}
	}

	/**
	 * High-level handler that manages the entire URL healing workflow
	 * Provides excellent DX by handling parsing, fetching, validation, and redirects in one call
	 * @param config - Configuration object with fetcher, slug extraction, and options
	 * @returns The fetched entity data, ready for your load function
	 * @example
	 * ```typescript
	 * export const load: PageServerLoad = async ({ params, url }) => {
	 *   return myHealer.handleRoute({
	 *     slug: params.id,
	 *     searchParams: url.searchParams,
	 *     fetcher: async (id) => {
	 *       const article = await getArticle(id);
	 *       return article ? { entity: article, slug: article.title } : null;
	 *     },
	 *     onNotFound: () => error(404, 'Article not found'),
	 *     transform: (article) => ({ article })
	 *   });
	 * };
	 * ```
	 */
	async handleRoute<TEntity = unknown, TResult = TEntity>(config: {
		/**
		 * The URL slug to parse and extract the ID from.
		 * @example params.id from your load function (e.g. { id: 'my-article_123' })
		 */
		slug: string;
		/**
		 * URL search parameters to preserve during redirects
		 * @example url.searchParams from your load function
		 */
		searchParams?: URLSearchParams;
		/**
		 * Async function to fetch your entity by ID
		 * Should return null if entity is not found
		 * @param id - The extracted ID to fetch with
		 * @returns Object containing the entity and its canonical slug, or null
		 * @example
		 * ```typescript
		 * async (id) => {
		 *   const article = await getArticle(id);
		 *   return article ? { entity: article, slug: article.title } : null;
		 * }
		 * ```
		 */
		fetcher: (id: string) => Promise<{ entity: TEntity; slug: string } | null>;
		/**
		 * Called when the entity is not found
		 * Typically throws a 404 error
		 * @example () => error(404, 'Article not found')
		 */
		onNotFound?: () => never;
		/**
		 * Transform the entity before returning
		 * Useful for shaping the data for your page
		 * @param entity - The fetched entity
		 * @returns The transformed data
		 * @example (article) => ({ article, meta: { views: 0 } })
		 */
		transform?: (entity: TEntity) => TResult;
	}): Promise<TResult> {
		const id = this.extractId(config.slug);

		const result = await config.fetcher(id);

		if (!result) {
			if (config.onNotFound) {
				config.onNotFound();
			}
			throw error(404, `Entity with ID "${id}" not found`);
		}

		this.validateAndRedirect({
			entity: { id, slug: result.slug },
			currentSlug: config.slug,
			searchParams: config.searchParams
		});

		if (config.transform) {
			return config.transform(result.entity);
		}

		return result.entity as unknown as TResult;
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
	 * @param slug - The URL slug containing the encoded ID
	 * @returns The original typed ID
	 */
	extractId(slug: string): TId {
		const stringId = this.healer.extractId(slug);
		return this.idDecoder(stringId);
	}

	/**
	 * Checks if a URL slug is in its canonical form
	 * @param expectedSlug - The expected canonical URL slug
	 * @param actualSlug - The actual URL slug to check
	 * @returns True if the slug is already canonical, false otherwise
	 */
	isCanonical(expectedSlug: string, actualSlug: string): boolean {
		return this.healer.isCanonical(expectedSlug, actualSlug);
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
	tryExtractId(combined: string): TId | null {
		try {
			return this.extractId(combined);
		} catch {
			return null;
		}
	}
}
