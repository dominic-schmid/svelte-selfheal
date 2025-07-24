import { unicode, simple, preserve, business } from '$lib/sanitizers.js';
import { describe, expect, it } from 'vitest';

describe('Sanitizers', () => {
	describe('unicode sanitizer (default)', () => {
		const testCases = [
			['Café & Résumé', 'cafe-resume'],
			['UPPERCASE TEXT', 'uppercase-text'],
			['multiple   spaces', 'multiple-spaces'],
			['hello@world!#$%', 'helloworld'],
			['hello---world', 'hello-world'],
			['---hello world---', 'hello-world'],
			['', ''],
			['!@#$%^&*()', '']
		];

		testCases.forEach(([input, expected]) => {
			it(`"${input}" → "${expected}"`, () => {
				expect(unicode(input)).toBe(expected);
			});
		});
	});

	describe('simple sanitizer', () => {
		const testCases = [
			['Café & Résumé', 'cafe-and-resume'],
			['contact@example.com', 'contact-at-examplecom'],
			['C++ Programming', 'c-plus-plus-programming'],
			['Node.js & Express + TypeScript', 'nodejs-and-express-plus-typescript']
		];

		testCases.forEach(([input, expected]) => {
			it(`"${input}" → "${expected}"`, () => {
				expect(simple(input)).toBe(expected);
			});
		});
	});

	describe('preserve sanitizer', () => {
		const testCases = [
			['Café & Résumé', 'café-&-résumé'],
			['file<name>with:bad|chars', 'filenamewithbadchars'],
			['hello@world.com', 'hello@world.com'],
			['PRESERVE Case', 'preserve-case']
		];

		testCases.forEach(([input, expected]) => {
			it(`"${input}" → "${expected}"`, () => {
				expect(preserve(input)).toBe(expected);
			});
		});
	});

	describe('business sanitizer', () => {
		const testCases = [
			['Tech Corp Inc.', 'tech'],
			['Example LLC', 'example'],
			['Acme Corp & Associates Inc.', 'acme-and-associates'],
			['Tech & Innovation LLC', 'tech-and-innovation'],
			['Café Corp', 'cafe']
		];

		testCases.forEach(([input, expected]) => {
			it(`"${input}" → "${expected}"`, () => {
				expect(business(input)).toBe(expected);
			});
		});
	});

	describe('edge cases', () => {
		const sanitizers = { unicode, simple, preserve, business };

		it('handle empty/whitespace input', () => {
			Object.values(sanitizers).forEach((sanitizer) => {
				expect(sanitizer('   ')).toBe('');
			});
		});

		it('handle normal text consistently', () => {
			const result = 'test-123-article';
			Object.values(sanitizers).forEach((sanitizer) => {
				expect(sanitizer('test 123 article')).toBe(result);
			});
		});
	});
});
