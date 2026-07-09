export type Author = {
  id: number;
  name: string;
};

/** Replace with your DB or API lookup. */
export const getAuthor = async (id: number): Promise<Author | null> => {
  return null;
};
