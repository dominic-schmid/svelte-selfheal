import { Healer } from '$lib/index.js';
import { describe, expect, it } from 'vitest';

describe('Replacements', () => {
	const replacementTests = [
		{
			name: 'all default replacements',
			config: {},
			cases: {
				'file.name & test@site.com + more_stuff': 'file-name-and-test-at-site-com-plus-more-stuff',
				'Price: $50 @ 10% off!': 'price-50-at-10-off',
				'Hello & World + Test': 'hello-and-world-plus-test'
			}
		},
		{
			name: 'disabled replacements',
			config: { replaceAmpersands: false, replaceDots: false },
			cases: {
				'file.name & test': 'filename-test', // & removed by sanitizer, . removed by sanitizer too
				'hello.world & test': 'helloworld-test'
			}
		},
		{
			name: 'custom replacements',
			config: { customReplacements: { '#': ' hash ', '%': ' percent ' } },
			cases: {
				'Value #1 is 50%': 'value-hash-1-is-50-percent',
				'Test #123 100%': 'test-hash-123-100-percent'
			}
		}
	];

	replacementTests.forEach(({ name, config, cases }) => {
		describe(name, () => {
			const healer = new Healer({ replacements: config });

			Object.entries(cases).forEach(([input, expected]) => {
				it(`"${input}" → "${expected}"`, () => {
					const url = healer.createUrl('123', input);
					expect(url).toBe(`123_${expected}`);
				});
			});
		});
	});

	it('works with other configurations', () => {
		const healer = new Healer({
			replacements: { customReplacements: { '#': ' tag ' } },
			order: 'id-last'
		});

		const url = healer.createUrl('456', 'Test #special');
		const extractedId = healer.extractId(url);
		expect(extractedId).toBe('456');

		// Should contain custom replacement
		expect(url).toContain('tag');
	});
});
