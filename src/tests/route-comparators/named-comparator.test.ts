import { NamedComparator } from '$lib/route-comparators/named-comparator.js';
import { describe, expect, it } from 'vitest';

describe('NamedComparator', () => {
	it.each([
		{
			description: 'returns true because both values are the same object',
			input: ['any-given-slug-123', 'any-given-slug-123'],
			expected: true,
		},
		{
			description: 'returns false because values are unequal using ===',
			input: ['any-given-slug-123', 'any-given-slug-456'],
			expected: false,
		},
		{
			description: 'returns false because the named comparator simply checks for equality of the strings',
			input: ['any-given-slug-123', 'any-given-slug-123?foo=bar'],
			expected: false,
		},
	])('%s', ({ input, expected }: { input: string[], expected: boolean }) => {
		const [a, b] = input;
		expect(NamedComparator(a, b)).toBe(expected);
	});
});
