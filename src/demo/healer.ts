import { getArticle } from './data.js';
import type { Article } from './data.js';
import { selfheal } from '$lib/index.js';

export const healer = selfheal();

/** Reusable heal layer for article route params — stack it at any depth. */
export const healArticle = healer.layer<Article>({
  fetch: getArticle,
  segment: (article) => ({ identifier: article.id, slug: article.title })
});
