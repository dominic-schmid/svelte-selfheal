import { Healer, separators, createSeparator } from '$lib/index.js';
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
