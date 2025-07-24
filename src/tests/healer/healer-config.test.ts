import { createSeparator, Healer, sanitizers, separators } from '$lib/index.js';
import { describe, expect, it } from 'vitest';

describe('Healer Configuration', () => {
	describe('custom sanitizer configuration', () => {
		it('uses simple sanitizer when configured', () => {
			const healer = new Healer({
				sanitizer: sanitizers.simple
			});

			const url = healer.createUrl('123', 'Café & Résumé');
			expect(url).toBe('cafe-and-resume.123');
		});

		it('uses business sanitizer when configured', () => {
			const healer = new Healer({
				sanitizer: sanitizers.business
			});

			const url = healer.createUrl('456', 'Tech Corp Inc.');
			expect(url).toBe('tech.456');
		});

		it('uses preserve sanitizer when configured', () => {
			const healer = new Healer({
				sanitizer: sanitizers.preserve
			});

			const url = healer.createUrl('789', 'Café & Test');
			expect(url).toBe('café-&-test.789');
		});

		it('uses custom sanitizer function', () => {
			const customSanitizer = (input: string) => input.toUpperCase().replace(/\s/g, '_');
			const healer = new Healer({
				sanitizer: customSanitizer
			});

			const url = healer.createUrl('999', 'hello world');
			expect(url).toBe('HELLO_WORLD.999');
		});
	});

	describe('custom separator configuration', () => {
		it('uses underscore separator when configured', () => {
			const healer = new Healer({
				separator: separators.underscore
			});

			const url = healer.createUrl('123', 'my article');
			expect(url).toBe('my-article_123');

			const parsedId = healer.parseId(url);
			expect(parsedId).toBe('123');
		});

		it('uses tilde separator when configured', () => {
			const healer = new Healer({
				separator: separators.tilde
			});

			const url = healer.createUrl('456', 'my article');
			expect(url).toBe('my-article~456');

			const parsedId = healer.parseId(url);
			expect(parsedId).toBe('456');
		});

		it('uses custom separator function', () => {
			const customSeparator = {
				join: (slug: string, id: string) => (slug ? `${slug}::${id}` : id),
				separate: (combined: string) => {
					const lastIndex = combined.lastIndexOf('::');
					if (lastIndex === -1) return { slug: '', id: combined };
					return {
						slug: combined.substring(0, lastIndex),
						id: combined.substring(lastIndex + 2)
					};
				}
			};

			const healer = new Healer({
				separator: customSeparator
			});

			const url = healer.createUrl('789', 'my test');
			expect(url).toBe('my-test::789');

			const parsedId = healer.parseId(url);
			expect(parsedId).toBe('789');
		});
	});

	describe('order configuration', () => {
		it('uses default order (slug.id) when not specified', () => {
			const healer = new Healer();
			const url = healer.createUrl('123', 'my article');
			expect(url).toBe('my-article.123');
		});

		it('uses default order when explicitly set', () => {
			const healer = new Healer({
				order: 'default'
			});
			const url = healer.createUrl('456', 'my article');
			expect(url).toBe('my-article.456');
		});

		it('uses reversed order (id.slug) when configured', () => {
			const healer = new Healer({
				order: 'reversed'
			});
			const url = healer.createUrl('789', 'my article');
			expect(url).toBe('789.my-article');

			const parsedId = healer.parseId(url);
			expect(parsedId).toBe('789');
		});

		it('handles reversed order with different separators', () => {
			const healer = new Healer({
				separator: separators.underscore,
				order: 'reversed'
			});

			const url = healer.createUrl('999', 'test article');
			expect(url).toBe('999_test-article');

			const parsedId = healer.parseId(url);
			expect(parsedId).toBe('999');
		});
	});

	describe('combined configurations', () => {
		it('works with all custom configurations', () => {
			const healer = new Healer({
				sanitizer: sanitizers.simple,
				separator: separators.underscore,
				order: 'reversed'
			});

			const url = healer.createUrl('123', 'Tech & Innovation');
			expect(url).toBe('123_tech-and-innovation');

			const parsedId = healer.parseId(url);
			expect(parsedId).toBe('123');

			const isValid = healer.validate(url, url);
			expect(isValid).toBe(true);

			const isDifferent = healer.validate(url, '123_different-title');
			expect(isDifferent).toBe(false);
		});

		it('handles complex IDs with custom configuration', () => {
			const healer = new Healer({
				sanitizer: sanitizers.business,
				separator: separators.tilde,
				order: 'default'
			});

			const complexId = 'user:123/org:456';
			const url = healer.createUrl(complexId, 'Acme Corp Dashboard');
			expect(url).toBe('acme-dashboard~user%3A123%2Forg%3A456');

			const parsedId = healer.parseId(url);
			expect(parsedId).toBe(complexId);
		});
	});

	describe('search parameters', () => {
		it('appends search parameters with any configuration', () => {
			const healer = new Healer({
				separator: separators.underscore,
				order: 'reversed'
			});

			const params = new URLSearchParams({ page: '2', sort: 'date' });
			const url = healer.createUrl('456', 'article title', params);
			expect(url).toBe('456_article-title?page=2&sort=date');
		});

		it('handles empty search parameters', () => {
			const healer = new Healer();
			const params = new URLSearchParams();
			const url = healer.createUrl('789', 'test', params);
			expect(url).toBe('test.789'); // No query string added for empty params
		});
	});

	describe('convenience methods', () => {
		it('validateOrRedirect throws redirect on mismatch', () => {
			const healer = new Healer();
			const expectedUrl = healer.createUrl('123', 'my article');

			// Should not throw on valid URL
			expect(() => healer.validateOrRedirect(expectedUrl, 'my-article.123')).not.toThrow();

			// Should throw redirect on invalid URL
			expect(() => healer.validateOrRedirect(expectedUrl, 'wrong-title.123')).toThrow();
		});

		it('safeParse handles different input formats', () => {
			const healer = new Healer();

			// Standard format with separator
			expect(healer.safeParse('my-article.123')).toBe('123');

			// No separator - treats whole string as ID (valid for self-healing)
			expect(healer.safeParse('no-separator')).toBe('no-separator');

			// Empty string - treats as empty ID
			expect(healer.safeParse('')).toBe('');
		});

		it('safeParse works with different separators', () => {
			const healer = new Healer({
				separator: createSeparator(';')
			});

			// With separator
			expect(healer.safeParse('article;123')).toBe('123');

			// No separator - treats whole string as ID (self-healing behavior)
			expect(healer.safeParse('no-underscore')).toBe('no-underscore');
		});

		it('validateAndRedirect simplifies load function logic', () => {
			const healer = new Healer();

			// Correct slug - should not throw
			expect(() =>
				healer.validateAndRedirect({
					entity: { id: '123', slug: 'My Article' },
					currentSlug: 'my-article.123'
				})
			).not.toThrow();

			// Wrong slug - should throw redirect
			expect(() =>
				healer.validateAndRedirect({
					entity: { id: '123', slug: 'My Article' },
					currentSlug: 'wrong-title.123'
				})
			).toThrow();

			// With search params
			const params = new URLSearchParams({ page: '2' });
			expect(() =>
				healer.validateAndRedirect({
					entity: { id: '123', slug: 'My Article' },
					currentSlug: 'my-article.123',
					searchParams: params
				})
			).not.toThrow();

			expect(() =>
				healer.validateAndRedirect({
					entity: { id: '123', slug: 'My Article' },
					currentSlug: 'wrong-title.123',
					searchParams: params
				})
			).toThrow();
		});
	});
});
