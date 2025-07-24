import { Healer } from '$lib/index.js';
import { describe, expect, it } from 'vitest';

// Init a healer using the default configuration (V2 zero-config)
const healer = new Healer();

describe('V2 Healer - Zero Config Usage', () => {
	describe('createUrl', () => {
		it('sanitizes the slug and joins it with the identifier using dot separator', () => {
			const slug = 'An unformatted SLUG';
			const identifier = '123';
			expect(healer.createUrl(identifier, slug)).toBe('an-unformatted-slug.123');
		});

		it('appends any given search params to the URL', () => {
			const slug = 'An unformatted SLUG';
			const identifier = '123';
			const params = new URLSearchParams({ test: 'true', numbers: '999' });

			expect(healer.createUrl(identifier, slug, params)).toBe(
				'an-unformatted-slug.123?test=true&numbers=999'
			);
		});

		it('handles empty slug by returning just the identifier', () => {
			const slug = '';
			const identifier = '123';
			expect(healer.createUrl(identifier, slug)).toBe('123');
		});

		it('handles special characters in ID by URL encoding', () => {
			const slug = 'dashboard';
			const identifier = 'user:123/org:456';
			expect(healer.createUrl(identifier, slug)).toBe('dashboard.user%3A123%2Forg%3A456');
		});

		it('normalizes unicode characters in slug', () => {
			const slug = 'Café & Résumé';
			const identifier = '789';
			expect(healer.createUrl(identifier, slug)).toBe('cafe-resume.789');
		});
	});

	describe('parseId', () => {
		it('extracts the correct identifier from dot-separated URL', () => {
			expect(healer.parseId('an-unformatted-slug.123')).toBe('123');
		});

		it('handles URL-encoded identifiers by decoding them', () => {
			expect(healer.parseId('dashboard.user%3A123%2Forg%3A456')).toBe('user:123/org:456');
		});

		it('handles ID-only URLs without slug', () => {
			expect(healer.parseId('123')).toBe('123');
		});

		it('handles empty input', () => {
			expect(healer.parseId('')).toBe('');
		});
	});

	describe('validate', () => {
		it('returns true for exact matches', () => {
			const url = 'my-article.123';
			expect(healer.validate(url, url)).toBe(true);
		});

		it('returns false for different URLs', () => {
			const expected = 'my-article.123';
			const actual = 'different-title.123';
			expect(healer.validate(expected, actual)).toBe(false);
		});

		it('returns false for same ID but different slug', () => {
			const expected = 'original-title.123';
			const actual = 'updated-title.123';
			expect(healer.validate(expected, actual)).toBe(false);
		});
	});
});
