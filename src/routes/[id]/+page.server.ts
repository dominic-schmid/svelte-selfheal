import type { PageServerLoad } from './$types.js';
import { healer } from '$lib/selfheal.js';
import { error, redirect } from '@sveltejs/kit';
import { db } from '$lib/db.js';

export const load: PageServerLoad = async ({ params }) => {
	const { identifier, shouldRedirect, reroute, create } = healer;

	// Get the identifier from the slug using the identifier handler
	const { identifier: id } = identifier.separate(params.id);

	// Query the database for the data using the identifier,
	// so you can construct a slug again and check if it matches the current one
	const article = db.articles.find((article) => String(article.id) === id);
	if (!article) throw error(404, `Article ${identifier} not found`);

	const slug = create(article.title, article.id); // Create the correct slug using db data

	// Either use the built-in rerouter to go to the correct slug (if applicable)
	reroute(slug, params.id);

	// Or manually check and handle the error case yourself
	if (shouldRedirect(slug, params.id)) throw redirect(301, slug);

	return { article, slug: params.id };
};
