import { NamedRerouter } from '$lib/rerouters/named-rerouter.js';
import { describe, expect, it } from 'vitest';

describe('NamedRerouter', () => {
	it('Does not throw and returns nothing because both tested values are the same', () => {
		const a = 'any-given-slug-123';
		expect(NamedRerouter(a, a)).toBeUndefined();
	});

	it('throw because values differ', () => {
		const a = 'any-given-slug-123';
		const b = 'any-given-slug-456';
		expect(() => NamedRerouter(a, b)).toThrow();
	});

	it('throw because values differ', () => {
		const a = 'any-given-slug-123';
		const b = 'any-given-slug-123?foo=bar';
		expect(() => NamedRerouter(a, b)).toThrow();
	});
});
