import { healArticle, healer } from '$lib/healer.js';
import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types.js';

export const load: PageServerLoad = async ({ params, url }) => {
  const result = await healer.run(healArticle(params.id), url.searchParams);
  if (result.notFound) error(404, 'Article not found');
  if (result.redirect) redirect(301, result.redirect);

  const [article] = result.resources;
  return { article };
};
