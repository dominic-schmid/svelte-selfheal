export type Article = {
  id: number;
  title: string;
};

/** Replace with your DB or API lookup. */
export const getArticle = async (id: number): Promise<Article | null> => {
  return null;
};
