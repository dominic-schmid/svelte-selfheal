import { db } from '$demo/mock/db.js';
import { articleHealer } from '$demo/mock/healer.js';
import type { PageServerLoad } from './$types.js';

export const load: PageServerLoad = async ({ params, url }) => {
	return articleHealer.handleRoute({
		slug: params.innerId,
		searchParams: url.searchParams,
		fetcher: async (id) => {
			const article = db.articles.find((article) => String(article.id) === id);
			return article ? { entity: article, slug: article.title } : null;
		},
		transform: (article) => ({ article, slug: params.innerId })
	});
};
