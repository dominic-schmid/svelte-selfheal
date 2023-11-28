import { db } from '$lib/db.js';
import type { PageLoad } from './$types.js';

export const load = (async () => {
	return {
		articles: db.articles
	};
}) satisfies PageLoad;
