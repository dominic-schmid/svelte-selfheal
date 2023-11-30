import { KebabSlugSanitizer } from '$lib/slug-sanitizers/kebab-slug-sanitizer.js';
import { describe, expect, it } from 'vitest';

describe('KebabSlugSanitizer', () => {
	it('makes the slug lowercase', () => {
		const slug = 'AN UPPERCASE SLUG';
		expect(KebabSlugSanitizer(slug)).toBe('an-uppercase-slug');
	});

	it('removes anything that isnt alphanumeric, a dash, underscore or space', () => {
		const badCharacters = [
			'!',
			'@',
			'#',
			'$',
			'%',
			'^',
			'&',
			'*',
			'(',
			')',
			'=',
			'+',
			'[',
			']',
			'{',
			'}',
			'|',
			'\\',
			'/',
			'<',
			'>',
			'?',
			',',
			'.',
			'`',
			'~',
			"'",
			'"',
			';',
			':'
		];

		badCharacters.forEach((char) => {
			it(`removes ${char}`, () => {
				expect(KebabSlugSanitizer(char)).toBe('');
			});
		});
	});

	it('replaces spaces with hyphens', () => {
		const slug = 'any given slug';
		expect(KebabSlugSanitizer(slug)).toBe('any-given-slug');
	});

	it('removes multiple hyphens', () => {
		const slug = 'any--given------slug-123';
		expect(KebabSlugSanitizer(slug)).toBe('any-given-slug-123');
	});

	it('removes hyphens from the start and end', () => {
		const slug = '-any-given-slug-';
		expect(KebabSlugSanitizer(slug)).toBe('any-given-slug');
	});
});
