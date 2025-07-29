import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types.js';
import { db } from '$lib/mock/db.js';
import { articleHealer } from '$lib/mock/healer.js';

// ✨ NEW: Clean one-liner using handleRoute
export const load: PageServerLoad = async ({ params, url }) => {
	return articleHealer.handleRoute({
		slug: params.id,
		searchParams: url.searchParams,
		fetcher: async (id) => {
			const article = db.articles.find((article) => String(article.id) === id);
			return article ? { entity: article, slug: article.title } : null;
		},
		onNotFound: () => error(404, 'Article not found'),
		transform: (article) => ({ article, slug: params.id })
	});
};
