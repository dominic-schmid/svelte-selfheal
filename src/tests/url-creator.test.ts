import { selfheal } from '$lib/index.js';
import { describe, expect, it } from 'vitest';

describe('URL creator', () => {
	const healer = selfheal();

	it('sanitizes the slug and joins it with the identifier', () => {
		const slug = 'An unformatted SLUG';
		const identifier = '123';
		expect(healer.create(slug, identifier)).toBe('an-unformatted-slug-123');
	});

	it('produces the same result as simply calling sanitize and join separately', () => {
		const slug = 'An unformatted SLUG';
		const identifier = '123';
		expect(healer.create(slug, identifier)).toBe(
			healer.identifier.join(healer.sanitize(slug), identifier)
		);
	});
});
