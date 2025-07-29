import { db } from '$lib/mock/db.js';
import type { PageLoad } from './$types.js';

export const load = (async () => {
	return {
		articles: db.articles,
		users: db.users,
		products: db.products
	};
}) satisfies PageLoad;
