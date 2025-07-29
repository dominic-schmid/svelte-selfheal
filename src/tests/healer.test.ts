import { Healer, sanitizers, createLengthPrefixedSeparator } from '$lib/index.js';
import { describe, expect, it } from 'vitest';

describe('Healer', () => {
	describe('URL creation and parsing', () => {
		const testCases = [
			{ id: '123', slug: 'My Article Title' },
			{ id: 'user:123/org:456', slug: 'Dashboard' },
			{ id: 'special-chars-without-underscore', slug: '' },
			{ id: '123', slug: 'Café & Résumé' },
			{ id: '789', slug: 'Multiple   Spaces   Here' }
		];

		testCases.forEach(({ id, slug }) => {
			it(`round-trip: id="${id}", slug="${slug}"`, () => {
				const healer = new Healer();
				const url = healer.createUrl(id, slug);
				const extractedId = healer.extractId(url);
				expect(extractedId).toBe(id);
			});
		});

		it('handles search parameters', () => {
			const healer = new Healer();
			const params = new URLSearchParams({ page: '2', filter: 'active' });
			const url = healer.createUrl('123', 'test', params);

			expect(url).toContain('?page=2');
			expect(url).toContain('filter=active');

			// Extract ID should ignore search params
			const extractedId = healer.extractId(url);
			expect(extractedId).toBe('123');
		});

		it('validates canonical URLs', () => {
			const healer = new Healer();
			const canonical = healer.createUrl('123', 'test article');

			expect(healer.isCanonical(canonical, canonical)).toBe(true);
			expect(healer.isCanonical(canonical, 'different-slug')).toBe(false);
		});
	});

	describe('Configuration options', () => {
		const configTests = [
			{
				name: 'simple sanitizer',
				config: { sanitizer: sanitizers.simple },
				input: ['123', 'Café & Test']
			},
			{
				name: 'tilde separator',
				config: { separator: '~' },
				input: ['456', 'My Article']
			},
			{
				name: 'id-last order',
				config: { order: 'id-last' as const },
				input: ['789', 'Test Article']
			},
			{
				name: 'combined options',
				config: {
					sanitizer: sanitizers.preserve,
					separator: '.',
					order: 'id-last' as const
				},
				input: ['999', 'Tech Corp Inc.']
			}
		];

		configTests.forEach(({ name, config, input }) => {
			it(`works with ${name}`, () => {
				const healer = new Healer(config);
				const [id, slug] = input;
				const url = healer.createUrl(id, slug);
				const extractedId = healer.extractId(url);
				expect(extractedId).toBe(id);
			});
		});
	});

	describe('Error handling', () => {
		const healer = new Healer();

		const errorCases = [
			{ input: '', description: 'empty string' },
			{ input: 'just-id-no-separator', description: 'no separator' },
			{ input: 'malformed.with.multiple.dots', description: 'multiple separators' }
		];

		errorCases.forEach(({ input, description }) => {
			it(`safely extracts from: ${description}`, () => {
				const result = healer.tryExtractId(input);
				if (input === '') {
					expect(result).toBe(''); // Empty input should return empty string
				} else {
					expect(typeof result).toBe('string');
					if (result !== null) {
						expect(result.length).toBeGreaterThan(0);
					}
				}
			});
		});
	});

	describe('Validation and redirects', () => {
		it('validates entities and redirects when needed', () => {
			const healer = new Healer();
			const entity = { id: '123', slug: 'Test Article' };
			const correctSlug = healer.createUrl(entity.id, entity.slug);

			// Should not throw on correct slug
			expect(() => healer.validateAndRedirect({ entity, currentSlug: correctSlug })).not.toThrow();

			// Should throw redirect on wrong slug
			expect(() => healer.validateAndRedirect({ entity, currentSlug: 'wrong-slug' })).toThrow();
		});
	});

	describe('Length-prefixed separator integration', () => {
		const lengthPrefixedHealer = new Healer({
			separator: createLengthPrefixedSeparator('-')
		});

		it('round-trip with UUID containing hyphens', () => {
			const uuid = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
			const slug = 'Widget'; // No hyphens to avoid separator conflicts

			const url = lengthPrefixedHealer.createUrl(uuid, slug);
			const extractedId = lengthPrefixedHealer.extractId(url);

			expect(extractedId).toBe(uuid);
			// Should start with a number (length prefix)
			expect(/^\d+/.test(url)).toBe(true);
		});

		it('round-trip with IDs containing separator character', () => {
			const id = 'user-123-admin';
			const slug = 'Dashboard'; // No hyphens to avoid separator conflicts

			const url = lengthPrefixedHealer.createUrl(id, slug);
			const extractedId = lengthPrefixedHealer.extractId(url);

			expect(extractedId).toBe(id);
		});

		it('works with id-last order', () => {
			const customHealer = new Healer({
				separator: createLengthPrefixedSeparator('|'),
				order: 'id-last'
			});

			const id = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
			const slug = 'test';

			const url = customHealer.createUrl(id, slug);
			const extractedId = customHealer.extractId(url);

			expect(extractedId).toBe(id);
			expect(url).toContain('|'); // Should use custom separator
		});

		it('handles empty slugs correctly', () => {
			const id = 'simple123'; // Use an ID without separators for empty slug test
			const url = lengthPrefixedHealer.createUrl(id, '');
			const extractedId = lengthPrefixedHealer.extractId(url);

			expect(url).toBe(id); // No prefix when no slug
			expect(extractedId).toBe(id);
		});

		it('validates and redirects with length-prefixed URLs', () => {
			const entity = {
				id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
				slug: 'My Product'
			};
			const correctSlug = lengthPrefixedHealer.createUrl(entity.id, entity.slug);

			// Should not throw on correct slug
			expect(() =>
				lengthPrefixedHealer.validateAndRedirect({
					entity,
					currentSlug: correctSlug
				})
			).not.toThrow();

			// Should throw redirect on wrong slug with same ID
			const wrongSlug = lengthPrefixedHealer.createUrl(entity.id, 'Wrong Title');
			expect(() =>
				lengthPrefixedHealer.validateAndRedirect({
					entity,
					currentSlug: wrongSlug
				})
			).toThrow();
		});
	});
});
