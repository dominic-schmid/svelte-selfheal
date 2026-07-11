import { healArticle, healAuthor, healer } from '$lib/healer.js';
import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types.js';

export const load: PageServerLoad = async ({ params, url }) => {
  const result = await healer.stack(
    [healArticle(params.id), 'details', healAuthor(params.innerId)],
    url.searchParams
  );
  if (result.notFound) error(404, 'Not found');
  if (result.redirect) redirect(301, result.redirect);

  const [article, author] = result.resources;
  return { article, author };
};
