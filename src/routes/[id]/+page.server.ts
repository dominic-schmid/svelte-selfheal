import { db } from '$lib/db.js';
import { healer } from '$lib/selfheal.js';
import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types.js';

export const load: PageServerLoad = async ({ params, url }) => {
	const identifier = healer.parseId(params.id);

	const article = db.articles.find((article) => String(article.id) === identifier);
	if (!article) throw error(404, `Article "${identifier}" not found`);

	const expectedUrl = healer.createUrl(article.id, article.title, url.searchParams);
	const valid = healer.validate(expectedUrl, params.id, url.searchParams);
	if (!valid) throw redirect(301, expectedUrl);

	return { article, slug: params.id };
};
