import { sanitizers } from '$lib/index.js';
import { describe, expect, it } from 'vitest';

describe('Sanitizers', () => {
	const sanitizerSpecs: Record<keyof typeof sanitizers, Record<string, string>> = {
		unicode: {
			'Café & Résumé': 'cafe-resume',
			'Tech Corp Inc.': 'tech-corp-inc',
			'hello@world.com': 'helloworldcom',
			'C++ Programming': 'c-programming',
			'Multiple   Spaces': 'multiple-spaces',
			'UPPERCASE TEXT': 'uppercase-text',
			'!@#$%^&*()': '',
			'': ''
		},
		simple: {
			'Café & Résumé': 'cafe-and-resume',
			'Tech Corp Inc.': 'tech-corp-inc',
			'hello@world.com': 'hello-at-worldcom',
			'C++ Programming': 'c-plus-plus-programming',
			'Multiple   Spaces': 'multiple-spaces',
			'UPPERCASE TEXT': 'uppercase-text',
			'!@#$%^&*()': 'at-and',
			'': ''
		},
		preserve: {
			'Café & Résumé': 'café-&-résumé',
			'Tech Corp Inc.': 'tech-corp-inc.',
			'hello@world.com': 'hello@world.com',
			'C++ Programming': 'c++-programming',
			'Multiple   Spaces': 'multiple-spaces',
			'UPPERCASE TEXT': 'uppercase-text',
			'!@#$%^&*()': '!@#$%^&()',
			'': ''
		}
	};

	Object.entries(sanitizerSpecs).forEach(([name, expectations]) => {
		describe(name, () => {
			Object.entries(expectations).forEach(([input, expected]) => {
				it(`"${input}" → "${expected}"`, () => {
					expect(sanitizers[name as keyof typeof sanitizers](input)).toBe(expected);
				});
			});
		});
	});
});
