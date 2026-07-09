import { selfheal } from 'svelte-selfheal';
import { getArticle } from '$lib/db/articles.js';
import { getAuthor } from '$lib/db/authors.js';

export const healer = selfheal();

export const healArticle = healer.layer({
  fetch: getArticle,
  segment: (article) => ({ identifier: article.id, slug: article.title })
});

export const healAuthor = healer.layer({
  fetch: getAuthor,
  segment: (author) => ({ identifier: author.id, slug: author.name })
});
