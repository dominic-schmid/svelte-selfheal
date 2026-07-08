export interface Article {
  id: number;
  title: string;
}

/** Mock articles for the demo site. */
export const articles: Article[] = [
  {
    id: 1,
    title: 'The article title'
  },
  {
    id: 2,
    title: 'Another article'
  },
  {
    id: 3,
    title: 'third'
  },
  {
    id: 123,
    title: ''
  },
  {
    id: 4,
    title: 'Why did the chicken cross the road?? And more!'
  }
];

/**
 * Simulates an async database lookup (a real app would hit a DB here).
 * Returns `undefined` when no article matches the identifier.
 */
export const getArticle = (id: string): Promise<Article | undefined> =>
  Promise.resolve(articles.find((article) => String(article.id) === id));
