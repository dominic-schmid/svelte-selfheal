import { selfheal } from '$lib/index.js';

export const articles = [
  { id: 1, title: 'The article title' },
  { id: 2, title: 'Another article' },
  { id: 123, title: '' },
  { id: 4, title: 'Why did the chicken cross the road?? And more!' }
] as const;

const getArticle = (id: string) =>
  Promise.resolve(articles.find((article) => String(article.id) === id));

export const healer = selfheal();

export const healArticle = healer.layer({
  fetch: getArticle,
  segment: (article) => ({ identifier: article.id, slug: article.title })
});
