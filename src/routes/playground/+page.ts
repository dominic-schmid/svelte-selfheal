import type { PageLoad } from './$types.js';

export const load: PageLoad = async () => {
	// The playground page manages its own state, but we provide some initial structure
	return {
		meta: {
			title: 'Healer Playground',
			description:
				'Interactive playground for testing healer configurations and URL generation patterns'
		}
	};
};
