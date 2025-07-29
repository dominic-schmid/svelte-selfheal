// Simple mock database for testing purposes
export const db = {
	articles: [
		{
			id: 1,
			title: 'The article title'
		},
		{
			id: 2,
			title: 'Über die Brücke 🌉'
		},
		{
			id: 3,
			title: 'こんにちは World!'
		},
		{
			id: 4,
			title: 'Café & Crêpes: A Tasting Guide'
		},
		{
			id: 5,
			title: '¿Cómo estás? 你好! привет'
		},
		{
			id: 6,
			title: 'Ελληνικά & العربية Mix'
		},
		{
			id: 123,
			title: '' // testing empty string too
		}
	],
	users: [
		{
			id: 'cl-2x0g-6c01',
			username: 'john_doe'
		},
		{
			id: 'cl-2x0g-6c02',
			username: 'jane_smith'
		},
		{
			id: 'cl-2x0g-6c03',
			username: 'alice_wonderland'
		},
		{
			id: 'cl-2x0g-6c04',
			username: '' // testing empty string too
		},
		{
			id: 'cl-2x0g-6c05',
			username: 'bob_builder'
		}
	]
};
