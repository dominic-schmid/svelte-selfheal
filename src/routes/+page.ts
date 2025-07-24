import { db } from '$lib/mock/db.js';
import type { PageLoad } from './$types.js';

export const load = (async () => {
	return {
		articles: db.articles
	};
}) satisfies PageLoad;
