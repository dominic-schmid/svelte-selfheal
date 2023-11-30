import { HyphenIdentifierHandler } from '$lib/identifier-handlers/hyphen-identifier-handler.js';
import { describe, expect, it } from 'vitest';

// TODO once implemented, test different configurations of the handler
describe('HyphenIdentifierHandler', () => {
	it('adds a hyphen between the two identifiers', () => {
		const slug = 'any-given-slug';
		const identifier = '123';
		expect(HyphenIdentifierHandler.join(slug, identifier)).toBe('any-given-slug-123');
	});

	it('separates the slug from the identifier', () => {
		const slug = 'any-given-slug-123';
		expect(HyphenIdentifierHandler.separate(slug)).toEqual({
			identifier: '123',
			slug: 'any-given-slug'
		});
	});

	it('returns only the ID if the slug is empty', () => {
		const slug = '';
		const identifier = '123';
		expect(HyphenIdentifierHandler.join(slug, identifier)).toBe('123');
	});
});
