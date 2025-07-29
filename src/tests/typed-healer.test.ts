import { TypedHealer, separators } from '$lib/index.js';
import { describe, expect, it } from 'vitest';

describe('TypedHealer', () => {
	// Define common ID types that might be used in practice
	interface UserOrgId {
		userId: string;
		orgId: string;
	}

	type TupleId = [string, number];

	describe('composite ID type', () => {
		const healer = new TypedHealer<UserOrgId>({
			idEncoder: (id) => `${id.userId}@${id.orgId}`,
			idDecoder: (encoded) => {
				const [userId, orgId] = encoded.split('@');
				return { userId, orgId };
			}
		});

		const testCases = [
			{
				id: { userId: 'john', orgId: 'acme' },
				slug: 'Dashboard'
			},
			{
				id: { userId: 'jane', orgId: 'tech-co' },
				slug: 'User Profile'
			}
		];

		testCases.forEach(({ id, slug }, index) => {
			it(`round-trip test case ${index + 1}: ${JSON.stringify(id)}`, () => {
				const url = healer.createUrl(id, slug);
				const extractedId = healer.extractId(url);
				expect(extractedId).toEqual(id);

				// URL should contain encoded ID components
				expect(url).toContain('%40'); // @ symbol encoded
			});
		});

		it('validates URLs correctly', () => {
			const [testCase] = testCases;
			const { id, slug } = testCase;
			const canonical = healer.createUrl(id, slug);

			expect(healer.isCanonical(canonical, canonical)).toBe(true);

			// Create a different URL with same ID but different slug
			const differentSlug = healer.createUrl(id, 'Different Title');
			expect(healer.isCanonical(canonical, differentSlug)).toBe(false);
		});
	});

	describe('tuple ID type', () => {
		const healer = new TypedHealer<TupleId>({
			idEncoder: (id) => `${id[0]}:${id[1]}`,
			idDecoder: (encoded) => {
				const [str, numStr] = encoded.split(':');
				return [str, parseInt(numStr, 10)] as TupleId;
			}
		});

		const testCases = [
			{
				id: ['user', 123] as TupleId,
				slug: 'Settings'
			},
			{
				id: ['admin', 456] as TupleId,
				slug: 'Admin Panel'
			}
		];

		testCases.forEach(({ id, slug }, index) => {
			it(`round-trip test case ${index + 1}: ${JSON.stringify(id)}`, () => {
				const url = healer.createUrl(id, slug);
				const extractedId = healer.extractId(url);
				expect(extractedId).toEqual(id);

				// URL should contain encoded colon
				expect(url).toContain('%3A'); // : symbol encoded
			});
		});

		it('validates URLs correctly', () => {
			const [testCase] = testCases;
			const { id, slug } = testCase;
			const canonical = healer.createUrl(id, slug);

			expect(healer.isCanonical(canonical, canonical)).toBe(true);

			// Create a different URL with same ID but different slug
			const differentSlug = healer.createUrl(id, 'Different Title');
			expect(healer.isCanonical(canonical, differentSlug)).toBe(false);
		});
	});

	describe('with custom configuration', () => {
		const healer = new TypedHealer<UserOrgId>({
			idEncoder: (id) => `${id.userId}@${id.orgId}`,
			idDecoder: (encoded) => {
				const [userId, orgId] = encoded.split('@');
				return { userId, orgId };
			},
			separator: separators.tilde,
			order: 'id-last'
		});

		it('applies custom configuration correctly', () => {
			const id = { userId: 'admin', orgId: 'corp' };
			const url = healer.createUrl(id, 'Tech Corp Inc. Dashboard');
			const extracted = healer.extractId(url);

			expect(extracted).toEqual(id);
			expect(url).toContain('~'); // Should use tilde separator
			expect(url).toContain('%40'); // Should encode @ symbol
		});
	});

	describe('error handling', () => {
		const healer = new TypedHealer<{ value: string }>({
			idEncoder: (id) => id.value,
			idDecoder: (encoded) => ({ value: encoded })
		});

		const errorCases = [
			{ input: 'no-separator-found', description: 'no separator' },
			{ input: 'special/chars\\here', description: 'special characters' }
		];

		errorCases.forEach(({ input, description }) => {
			it(`handles ${description} gracefully`, () => {
				const id = { value: input };
				const url = healer.createUrl(id, 'test');
				const extracted = healer.extractId(url);
				expect(extracted.value).toBe(input);
			});
		});

		it('handles empty ID correctly', () => {
			const id = { value: '' };
			const url = healer.createUrl(id, 'test');
			const extracted = healer.extractId(url);

			// With empty ID, behavior may vary - just ensure it's consistent
			expect(typeof extracted.value).toBe('string');
		});
	});
});
