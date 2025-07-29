import { Healer, separators, createSeparator, createLengthPrefixedSeparator } from '$lib/index.js';
import { describe, expect, it } from 'vitest';

describe('Separators (via Healer)', () => {
	const testCases = [
		{ id: '123', slug: 'my-article' },
		{ id: 'uuid-456', slug: 'user-profile' },
		{ id: '789', slug: '' }, // Empty slug
		{ id: 'complex-id', slug: 'complex.slug.with.dots' }
	];

	describe('built-in separators', () => {
		const separatorConfigs = [
			{ name: 'underscore', separator: separators.underscore },
			{ name: 'dot', separator: separators.dot },
			{ name: 'tilde', separator: separators.tilde }
		];

		separatorConfigs.forEach(({ name, separator }) => {
			describe(name, () => {
				testCases.forEach(({ id, slug }) => {
					it(`round-trip: id="${id}", slug="${slug}" (id-first)`, () => {
						const healer = new Healer({ separator, order: 'id-first' });
						const url = healer.createUrl(id, slug);
						const extractedId = healer.extractId(url);
						expect(extractedId).toBe(id);
					});

					it(`round-trip: id="${id}", slug="${slug}" (id-last)`, () => {
						const healer = new Healer({ separator, order: 'id-last' });
						const url = healer.createUrl(id, slug);
						const extractedId = healer.extractId(url);
						expect(extractedId).toBe(id);
					});
				});
			});
		});
	});

	describe('custom separators', () => {
		const customSeparators = ['|', '::', '---'];

		customSeparators.forEach((char) => {
			it(`round-trip with custom separator "${char}"`, () => {
				const healer = new Healer({
					separator: createSeparator(char),
					order: 'id-first'
				});

				const id = '123';
				const slug = 'test-slug';
				const url = healer.createUrl(id, slug);
				const extractedId = healer.extractId(url);

				expect(extractedId).toBe(id);
				expect(url).toContain(char); // Should contain the separator
			});
		});
	});

	describe('edge cases', () => {
		const healer = new Healer({ separator: separators.dot, order: 'id-first' });

		it('handles ID-only URLs (no slug)', () => {
			const id = 'just-an-id';
			const url = healer.createUrl(id, '');
			expect(url).toBe(id);
			expect(healer.extractId(url)).toBe(id);
		});

		it('handles complex IDs with multiple separators', () => {
			const id = 'complex.id.with.dots';
			const slug = 'simple-slug';
			const url = healer.createUrl(id, slug);
			const extractedId = healer.extractId(url);
			expect(extractedId).toBe(id);
		});

		it('handles malformed URLs gracefully', () => {
			const malformedUrl = 'just-text-no-separator';
			const result = healer.extractId(malformedUrl);
			expect(result).toBe(malformedUrl); // Should return the whole thing as ID
		});
	});

	describe('length-prefixed separator', () => {
		it('creates and parses length-prefixed URLs correctly', () => {
			const healer = new Healer({
				separator: createLengthPrefixedSeparator('-'),
				order: 'id-first'
			});

			const cases = [
				{ id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479', slug: 'widget' },
				{ id: '123', slug: 'article' },
				{ id: 'user-123-admin', slug: 'dashboard' },
				{ id: 'testid', slug: '' } // empty slug
			];

			cases.forEach(({ id, slug }) => {
				const url = healer.createUrl(id, slug);
				const extractedId = healer.extractId(url);
				expect(extractedId).toBe(id);

				// Length-prefixed URLs should start with a number when there's a slug
				if (slug) {
					expect(/^\d+/.test(url)).toBe(true);
				}
			});
		});

		it('works with id-last order', () => {
			const healer = new Healer({
				separator: createLengthPrefixedSeparator('|'),
				order: 'id-last'
			});

			const id = 'test123';
			const slug = 'article';
			const url = healer.createUrl(id, slug);
			const extractedId = healer.extractId(url);

			expect(extractedId).toBe(id);
			expect(url).toContain('|'); // Should use custom separator
		});

		it('handles malformed inputs gracefully', () => {
			const healer = new Healer({
				separator: createLengthPrefixedSeparator('-'),
				order: 'id-first'
			});

			const cases = [
				{ input: 'abc-test', expectedId: 'abc' }, // Invalid length prefix → fallback
				{ input: '5-short', expectedId: '5' }, // Length too big → fallback
				{ input: 'noseparators', expectedId: 'noseparators' } // No separators
			];

			cases.forEach(({ input, expectedId }) => {
				const result = healer.extractId(input);
				expect(result).toBe(expectedId);
			});
		});

		it('handles both length-prefixed and fallback cases', () => {
			const healer = new Healer({
				separator: createLengthPrefixedSeparator('-'),
				order: 'id-first'
			});

			const testCases = [
				// Length-prefixed cases (valid format)
				{ input: '4-test-slug', expectedId: 'test' },
				{ input: '7-user123-dashboard', expectedId: 'user123' },
				{
					input: '36-f47ac10b-58cc-4372-a567-0e02b2c3d479-widget',
					expectedId: 'f47ac10b-58cc-4372-a567-0e02b2c3d479'
				},

				// Fallback cases (invalid length prefix, uses regular separator)
				{ input: 'abc-test', expectedId: 'abc' }, // Invalid length, falls back to id-first regular separator
				{ input: 'some-text-here', expectedId: 'some-text' }, // No valid length, falls back
				{ input: '999-short', expectedId: '999' }, // Length too big, falls back

				// Edge cases
				{ input: 'no-separators', expectedId: 'no' }, // Regular separator: 'no' + 'separators'
				{ input: '3-abc', expectedId: '3' }, // Partial format: falls back to regular separator
				{ input: '3-abc-def', expectedId: 'abc' }, // Full length-prefixed format: valid
				{ input: 'noseparators', expectedId: 'noseparators' } // No separators at all
			];

			testCases.forEach(({ input, expectedId }) => {
				const result = healer.extractId(input);
				expect(result).toBe(expectedId);
			});
		});

		it('works with different separators', () => {
			const pipeHealer = new Healer({
				separator: createLengthPrefixedSeparator('|'),
				order: 'id-first'
			});

			const testCases = [
				{ input: '4|test|slug', expectedId: 'test' }, // Full format: valid length-prefixed
				{ input: '3|abc', expectedId: '3' }, // Partial format: falls back to regular separator
				{ input: 'noseparators', expectedId: 'noseparators' } // No separators
			];

			testCases.forEach(({ input, expectedId }) => {
				const result = pipeHealer.extractId(input);
				expect(result).toBe(expectedId);
			});
		});

		it('handles long content efficiently', () => {
			const healer = new Healer({
				separator: createLengthPrefixedSeparator('-'),
				order: 'id-first'
			});

			const longId = 'x'.repeat(500);
			const longUrl = `${longId.length}-${longId}-test`;

			const result = healer.extractId(longUrl);
			expect(result).toBe(longId);
		});
	});

	describe('consistency across orders', () => {
		const healer1 = new Healer({ order: 'id-first' });
		const healer2 = new Healer({ order: 'id-last' });

		it('both orders can extract IDs correctly', () => {
			const id = 'test-id-123';
			const slug = 'test-slug';

			// Create URLs with different orders
			const url1 = healer1.createUrl(id, slug);
			const url2 = healer2.createUrl(id, slug);

			// Each should extract their own correctly
			expect(healer1.extractId(url1)).toBe(id);
			expect(healer2.extractId(url2)).toBe(id);

			// URLs should be different
			expect(url1).not.toBe(url2);
		});
	});
});
