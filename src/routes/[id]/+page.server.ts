import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types.js';
import { db } from '$lib/mock/db.js';
import { myHealer } from '$lib/mock/healer.js';

export const load: PageServerLoad = async ({ params, url }) => {
	const identifier = myHealer.parseId(params.id);

	const article = db.articles.find((article) => String(article.id) === identifier);
	if (!article) throw error(404, `Article "${identifier}" not found`);

	// Validate and redirect if slug doesn't match canonical form
	myHealer.validateAndRedirect({
		entity: { id: article.id, slug: article.title },
		currentSlug: params.id,
		searchParams: url.searchParams
	});

	return { article, slug: params.id };
};
