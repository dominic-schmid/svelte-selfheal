import type { PageServerLoad } from './$types.js';
import { healer } from '$lib/selfheal.js';
import { error, redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params, request, url }) => {
	const { identifierHandler, shouldRedirect, slugSanitizer } = healer;

	console.log('----------------', { params });

	const { identifier, slug } = identifierHandler.separateFromSlug(params.id);
	console.log('Separated identifier from slug', { identifier, slug });

	const dbResult = db.articles.find((article) => String(article.id) === identifier);
	console.log('Queried database', { dbResult });

	if (!dbResult) throw error(404, `Article ${identifier} not found`);

	const sanitizedSlug = slugSanitizer(dbResult.title);
	console.log('Sanitized slug', dbResult.title, { sanitizedSlug });

	const joinedSlug = identifierHandler.joinToSlug(sanitizedSlug, identifier);
	console.log('Joined slug and identifier', { joinedSlug });

	if (shouldRedirect(joinedSlug, params.id)) {
		console.error('Redirecting...');
		throw redirect(301, joinedSlug);
	}
	return {
		article: dbResult
	};
};

// TOdo add a safe heal that in case parsing fails returns an object with an error property and a data property, like superforms

const db = {
	articles: [
		{
			id: 1,
			title: 'The article title'
		},
		{
			id: 2,
			title: 'Another article'
		},
		{
			id: 3,
			title: 'third'
		},
		{
			id: 123,
			title: '' // testing empty
		}
	]
};
