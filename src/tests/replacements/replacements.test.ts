import { applyReplacements, createReplacementSanitizer } from '$lib/replacements.js';
import { unicode } from '$lib/sanitizers.js';
import { describe, expect, it } from 'vitest';

describe('Replacement System', () => {
	describe('applyReplacements', () => {
		it('applies all default replacements', () => {
			const result = applyReplacements('file.name & test@site.com + more_stuff');
			expect(result).toBe('file-name-and-test-at-site-com-plus-more-stuff');
		});

		// Test each replacement type can be disabled
		const disableTests = [
			{ config: { replaceDots: false }, input: 'a.b', expected: 'a.b' },
			{ config: { replaceAmpersands: false }, input: 'a & b', expected: 'a-&-b' },
			{ config: { replaceAtSigns: false }, input: 'a@b', expected: 'a@b' },
			{ config: { replacePlus: false }, input: 'a+b', expected: 'a+b' },
			{ config: { replaceUnderscores: false }, input: 'a_b', expected: 'a_b' },
			{ config: { replaceSpaces: false }, input: 'a b', expected: 'a b' }
		];

		disableTests.forEach(({ config, input, expected }) => {
			const key = Object.keys(config)[0];
			it(`can disable ${key}`, () => {
				expect(applyReplacements(input, config)).toBe(expected);
			});
		});

		it('handles custom replacements and edge cases', () => {
			expect(
				applyReplacements('Value #1 is 50%', {
					customReplacements: { '#': ' hash ', '%': ' percent ' }
				})
			).toBe('Value- hash 1-is-50 percent ');

			expect(applyReplacements('')).toBe('');
		});
	});

	describe('createReplacementSanitizer', () => {
		it('combines replacements with sanitizer', () => {
			const sanitizer = createReplacementSanitizer({}, unicode);
			expect(sanitizer('Hello & Test@site.com')).toBe('hello-and-test-at-site-com');
		});

		it('applies replacements before sanitization', () => {
			const sanitizer = createReplacementSanitizer(
				{ customReplacements: { '#': ' hash ' } },
				unicode
			);
			expect(sanitizer('Test #1')).toBe('test-hash-1');
		});
	});
});
