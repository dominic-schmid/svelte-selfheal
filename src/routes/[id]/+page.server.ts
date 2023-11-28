import type { PageServerLoad } from './$types.js';
import { healer } from '$lib/selfheal.js';
import { error, redirect } from '@sveltejs/kit';
import { db } from '$lib/db.js';

export const load: PageServerLoad = async ({ params }) => {
	const {
		identifier: { join, separate },
		shouldRedirect,
		sanitize
	} = healer;

	const { identifier } = separate(params.id);

	// Query the database for the data so you can construct a slug and check if it matches the current one
	const article = db.articles.find((article) => String(article.id) === identifier);
	if (!article) throw error(404, `Article ${identifier} not found`);

	const sanitizedSlug = sanitize(article.title);
	const slug = join(sanitizedSlug, identifier); // The expected slug

	if (shouldRedirect(slug, params.id)) throw redirect(301, slug);

	return { article };
};
