import { healer } from '$lib/healer.js';
import { getArticle } from '$lib/db/articles.js';
import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types.js';

export const load: PageServerLoad = async ({ params, url }) => {
  const id = healer.parseId(params.id);
  const article = await getArticle(id);
  if (!article) error(404, 'Article not found');

  const to = healer.canonicalRedirect(
    [{ param: params.id, identifier: article.id, slug: article.title }],
    url.searchParams
  );
  if (to) redirect(301, to);

  return { article };
};
