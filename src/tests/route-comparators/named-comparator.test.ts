import { NamedComparator } from '$lib/route-comparators/named-comparator.js';
import { describe, expect, it } from 'vitest';

describe('NamedComparator', () => {
	it('returns true because both values are the same object', () => {
		const a = 'any-given-slug-123';
		expect(NamedComparator(a, a)).toBe(true);
	});

	it('returns false because values are unequal using ===', () => {
		const a = 'any-given-slug-123';
		const b = 'any-given-slug-456';
		expect(NamedComparator(a, b)).toBe(false);
	});

	it('returns false because the named comparator simply checks for equality of the strings', () => {
		const a = 'any-given-slug-123';
		const b = 'any-given-slug-123?foo=bar';
		expect(NamedComparator(a, b)).toBe(false);
	});
});
