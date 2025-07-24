import { Healer } from '$lib/index.js';
import { describe, expect, it } from 'vitest';

describe('Healer with Replacement Configuration', () => {
	it('uses all default replacements', () => {
		const healer = new Healer({ replacements: {} });
		const url = healer.createUrl('123', 'file.name & title @ site + more_stuff');
		expect(url).toBe('file-name-and-title-at-site-plus-more-stuff.123');
	});

	it('allows both sanitizer and replacements (replacements first)', () => {
		const customSanitizer = (input: string) => input.toUpperCase().replace(/\s+/g, '_');
		const healer = new Healer({
			sanitizer: customSanitizer,
			replacements: { replaceAmpersands: true, replaceSpaces: false }
		});
		expect(healer.createUrl('123', 'hello & world')).toBe('HELLO_AND_WORLD.123');
	});

	it('works without replacement config', () => {
		const healer = new Healer();
		expect(healer.createUrl('123', 'Café & Résumé')).toBe('cafe-resume.123');
	});

	// Test disabling specific replacements
	const disableTests = [
		{ config: { replaceDots: false }, input: 'a.b', contains: 'ab' }, // dots removed by sanitizer
		{ config: { replaceAmpersands: false }, input: 'a & b', contains: 'a-b' }, // & removed
		{ config: { replaceAtSigns: false }, input: 'a@b', contains: 'ab' }, // @ removed
		{ config: { replacePlus: false }, input: 'a+b', contains: 'ab' }, // + removed
		{ config: { replaceUnderscores: false }, input: 'a_b', contains: 'a_b' } // _ preserved
	];

	disableTests.forEach(({ config, input, contains }) => {
		const key = Object.keys(config)[0];
		it(`can disable ${key}`, () => {
			const healer = new Healer({ replacements: config });
			const url = healer.createUrl('123', input);
			expect(url).toContain(contains);
		});
	});

	it('handles custom replacements and works with other features', () => {
		const healer = new Healer({
			replacements: {
				customReplacements: { '#': ' hash ', $: ' dollar ' }
			},
			order: 'reversed'
		});

		const url = healer.createUrl('456', 'Price: $100 #special');
		expect(url).toBe('456.price-dollar-100-hash-special');
		expect(healer.parseId(url)).toBe('456');
	});

	it('works with search parameters', () => {
		const healer = new Healer({ replacements: { replaceAtSigns: true } });
		const params = new URLSearchParams({ email: 'test@example.com' });
		const url = healer.createUrl('789', 'contact@support', params);
		expect(url).toBe('contact-at-support.789?email=test%40example.com');
	});
});
