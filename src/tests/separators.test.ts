import { createSeparator, dot, underscore, tilde } from '$lib/separators.js';
import { describe, expect, it } from 'vitest';

describe('Separators', () => {
	describe('createSeparator', () => {
		it('creates separators for any character', () => {
			const pipe = createSeparator('|');
			expect(pipe.join('slug', '123')).toBe('slug|123');
			expect(pipe.separate('slug|123')).toEqual({ slug: 'slug', id: '123' });
		});

		it('handles edge cases', () => {
			const sep = createSeparator('.');

			// Empty slug, no separator found, multi-char separator, multiple occurrences
			expect(sep.join('', '456')).toBe('456');
			expect(sep.separate('just-id')).toEqual({ slug: '', id: 'just-id' });
			expect(sep.separate('a.b.c.123')).toEqual({ slug: 'a.b.c', id: '123' });

			const multiSep = createSeparator('--');
			expect(multiSep.join('slug', '789')).toBe('slug--789');
			expect(multiSep.separate('slug--789')).toEqual({ slug: 'slug', id: '789' });
		});
	});

	describe('built-in separators', () => {
		const separators = [
			{ name: 'dot', sep: dot, char: '.' },
			{ name: 'underscore', sep: underscore, char: '_' },
			{ name: 'tilde', sep: tilde, char: '~' }
		];

		separators.forEach(({ name, sep, char }) => {
			it(`${name} separator works correctly`, () => {
				const combined = `my-article${char}123`;
				expect(sep.join('my-article', '123')).toBe(combined);
				expect(sep.separate(combined)).toEqual({ slug: 'my-article', id: '123' });
				expect(sep.join('', '123')).toBe('123'); // Empty slug
			});
		});
	});
});
