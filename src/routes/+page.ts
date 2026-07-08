import { articles } from '$demo/data.js';
import type { PageLoad } from './$types.js';

export const load = (() => {
  return {
    articles
  };
}) satisfies PageLoad;
