import { selfheal } from 'svelte-selfheal';
import { getArticle } from '$lib/db/articles.js';

export const healer = selfheal();

export const healArticle = healer.layer({
  fetch: getArticle,
  segment: (article) => ({ identifier: article.id, slug: article.title })
});
