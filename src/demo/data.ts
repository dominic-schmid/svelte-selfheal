export interface Article {
  id: number;
  title: string;
}

export interface Author {
  id: number;
  name: string;
}

/** Mock article for the demo site. */
const articles: Article[] = [
  {
    id: 1,
    title: 'The article title'
  }
];

/** Mock author — second entity type for the nested stack() demo. */
const authors: Author[] = [
  {
    id: 2,
    name: 'Jane Doe'
  }
];

/**
 * Simulates an async database lookup (a real app would hit a DB here).
 * Returns `undefined` when no article matches the identifier.
 */
export const getArticle = (id: string): Promise<Article | undefined> =>
  Promise.resolve(articles.find((article) => String(article.id) === id));

/**
 * Simulates an async author lookup for nested route demos.
 * Returns `undefined` when no author matches the identifier.
 */
export const getAuthor = (id: string): Promise<Author | undefined> =>
  Promise.resolve(authors.find((author) => String(author.id) === id));
