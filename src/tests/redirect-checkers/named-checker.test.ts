import { NamedChecker } from '$lib/redirect-checkers/named-checker.js';
import { describe, expect, it } from 'vitest';

describe('NamedChecker', () => {
	it('returns false because both values are equal and thus we need not redirect', () => {
		const a = 'any-given-slug-123';
		expect(NamedChecker(a, a)).toBe(false);
	});

	it('returns true because both values are not equal and thus we need to redirect', () => {
		const a = 'any-given-slug-123';
		const b = 'any-given-slug-456';
		expect(NamedChecker(a, b)).toBe(true);
	});

	it('returns true because both values not equal as specified by the named checker implementation', () => {
		const a = 'any-given-slug-123';
		const b = 'any-given-slug-123?foo=bar';
		expect(NamedChecker(a, b)).toBe(true);
	});
});
