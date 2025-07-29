import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types.js';
import { db } from '$demo/mock/db.js';
import { userHealer } from '$demo/mock/healer.js';

// ✨ NEW: Clean one-liner using handleRoute
export const load: PageServerLoad = async ({ params, url }) => {
	const result = await userHealer.handleRoute({
		slug: params.uuid,
		searchParams: url.searchParams,
		fetcher: async (id) => {
			const user = db.users.find((user) => String(user.id) === id);
			return user ? { entity: user, slug: user.username } : null;
		},
		onNotFound: () => error(404, 'User not found')
	});

	console.log('Found user', result.username);

	return { user: result, slug: params.uuid };
};
