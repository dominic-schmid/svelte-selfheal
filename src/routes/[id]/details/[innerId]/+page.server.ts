import { healArticle, healAuthor, healer } from '$demo/healer.js';
import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types.js';

export const load: PageServerLoad = async ({ params }) => {
  const result = await healer.stack(
    [healArticle(params.id), 'details', healAuthor(params.innerId)],
    new URLSearchParams()
  );
  if (result.notFound) error(404, 'Not found');
  if (result.redirect) redirect(301, result.redirect);

  const [article, author] = result.resources;
  return { article, author, slug: params.innerId, parentSlug: params.id };
};
