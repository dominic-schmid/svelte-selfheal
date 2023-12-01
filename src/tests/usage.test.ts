import { selfheal } from '$lib/index.js';
import { describe, expect, it } from 'vitest';

// Init a healer using the default configuration
const healer = selfheal();

describe('URL creator', () => {
	it('sanitizes the slug and joins it with the identifier', () => {
		const slug = 'An unformatted SLUG';
		const identifier = '123';
		expect(healer.createUrl(identifier, slug)).toBe('an-unformatted-slug-123');
	});

	it('appends any given search params to the URL', () => {
		const slug = 'An unformatted SLUG';
		const identifier = '123';
		const params = new URLSearchParams({ test: 'true', numbers: '999' });

		expect(healer.createUrl(identifier, slug, params)).toBe(
			'an-unformatted-slug-123?test=true&numbers=999'
		);
	});
});

describe('URL parseId helper', () => {
	it('helper returns the correct identifier from the URL', () => {
		expect(healer.parseId('an-unformatted-slug-123')).toBe('123');
	});
});
