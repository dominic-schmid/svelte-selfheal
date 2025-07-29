import { get } from 'svelte/store';
import { playgroundStore } from '$lib/stores/playground.js';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types.js';

export const load: PageLoad = async ({ params, url }) => {
	const slug = params.id;

	if (!slug) {
		throw error(404, 'No slug provided');
	}

	// Get the current healer from the store
	const storeValue = get(playgroundStore);
	const currentHealer = storeValue.healer;

	// Extract ID from the slug
	const item = await currentHealer.handleRoute({
		slug,
		searchParams: url.searchParams,
		fetcher: async (id) => {
			const item = storeValue.items.find((item) => String(item.id) === id);
			return item ? { entity: item, slug: item.title } : null;
		},
		onNotFound: () => error(404, `Playground item ${slug} not found`)
	});

	// Generate the canonical URL using the current healer configuration
	const canonicalSlug = currentHealer.createUrl(item.id, item.title);

	return {
		item,
		slug: canonicalSlug,
		healerConfig: storeValue.configString
	};
};
