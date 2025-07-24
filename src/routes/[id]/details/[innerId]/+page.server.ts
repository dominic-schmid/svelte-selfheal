import { db } from '$lib/mock/db.js';
import { myHealer } from '$lib/mock/healer.js';
import type { PageServerLoad } from './$types.js';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params, url }) => {
	const identifier = myHealer.parseId(params.innerId);

	const article = db.articles.find((article) => String(article.id) === identifier);
	if (!article) throw error(404, `Article "${identifier}" not found`);

	myHealer.validateAndRedirect({
		entity: { id: article.id, slug: article.title },
		currentSlug: params.innerId,
		searchParams: url.searchParams
	});

	return { article, slug: params.innerId };
};
