import { simpleRouteEntries } from '$demo/prerender.js';
import { healArticle, healer } from '$demo/healer.js';
import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types.js';

export const entries = () => simpleRouteEntries();

export const load: PageServerLoad = async ({ params }) => {
  const result = await healer.run(healArticle(params.id), new URLSearchParams());
  if (result.notFound) error(404, 'Article not found');
  if (result.redirect) redirect(301, result.redirect);

  const [article] = result.resources;
  return { article, slug: params.id };
};
