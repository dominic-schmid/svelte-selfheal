import { getArticle, getAuthor } from './data.js';
import type { Article, Author } from './data.js';
import { selfheal } from '$lib/index.js';

export const healer = selfheal();

/** Reusable heal layer for article route params — stack it at any depth. */
export const healArticle = healer.layer<Article>({
  fetch: getArticle,
  segment: (article) => ({ identifier: article.id, slug: article.title })
});

/** Reusable heal layer for author route params in nested demos. */
export const healAuthor = healer.layer<Author>({
  fetch: getAuthor,
  segment: (author) => ({ identifier: author.id, slug: author.name })
});
