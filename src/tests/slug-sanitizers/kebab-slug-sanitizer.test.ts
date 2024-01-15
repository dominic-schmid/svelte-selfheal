import { KebabSlugSanitizer } from '$lib/slug-sanitizers/kebab-slug-sanitizer.js';
import { describe, expect, it } from 'vitest';

describe('KebabSlugSanitizer', () => {
	it('makes the slug lowercase', () => {
		const slug = 'AN UPPERCASE SLUG';
		expect(KebabSlugSanitizer(slug)).toBe('an-uppercase-slug');
	});

	it('removes non-alphanumeric characters', () => {
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
			':',
		];

		badCharacters.forEach((char) => {
			it(`removes ${char}`, () => {
				expect(KebabSlugSanitizer(char)).toBe('');
			});
		});
	});

	it('replaces spaces with hyphens and removes multiple hyphens', () => {
		const testCases = [
			{ input: 'any given slug', expected: 'any-given-slug' },
			{ input: 'any--given------slug-123', expected: 'any-given-slug-123' },
			{ input: '-any-given-slug-', expected: 'any-given-slug' },
		];

		testCases.forEach(({ input, expected }) => {
			it(`transforms "${input}" correctly`, () => {
				expect(KebabSlugSanitizer(input)).toBe(expected);
			});
		});
	});

	it('handles special characters and accents', () => {
		const testCases = [
			{ input: 'cliché café', expected: 'cliche-cafe' },
			{ input: 'mötörhëäd', expected: 'motorhead' },
		];

		testCases.forEach(({ input, expected }) => {
			it(`transforms "${input}" correctly`, () => {
				expect(KebabSlugSanitizer(input)).toBe(expected);
			});
		});
	});

	it('handles edge cases', () => {
		const testCases = [
			{ input: '', expected: '' }, // Empty string
			{ input: '   leading-trailing-whitespaces   ', expected: 'leading-trailing-whitespaces' },
			{ input: '___underscores___', expected: 'underscores' },
			{ input: '   multiple   spaces   ', expected: 'multiple-spaces' },
		];

		testCases.forEach(({ input, expected }) => {
			it(`transforms "${input}" correctly`, () => {
				expect(KebabSlugSanitizer(input)).toBe(expected);
			});
		});
	});
});
