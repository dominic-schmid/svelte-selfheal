import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types.js';
import { db } from '$lib/mock/db.js';
import { lengthPrefixedHealer } from '$lib/mock/healer.js';

// Length-prefixed healer: guaranteed to work with UUIDs containing hyphens
export const load: PageServerLoad = async ({ params, url }) => {
	return lengthPrefixedHealer.handleRoute({
		slug: params.id,
		searchParams: url.searchParams,
		fetcher: async (id) => {
			const product = db.products.find((product) => product.id === id);
			return product ? { entity: product, slug: product.title } : null;
		},
		onNotFound: () => error(404, 'Product not found'),
		transform: (product) => ({ product, slug: params.id })
	});
};
