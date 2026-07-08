/** Shared diacritic folding and word splitting before separator collapse. */
export const normalizeSlugBase = (slug: string, separator: '-' | '_'): string => {
  const edge = separator === '-' ? /^-+|-+$/g : /^_+|_+$/g;
  const repeat = separator === '-' ? /-{2,}/g : /_{2,}/g;
  const otherSep = separator === '-' ? '_' : '-';

  return slug
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .replace(/([a-z])([A-Z])/g, `$1${separator}$2`)
    .replace(new RegExp(`\\${otherSep}`, 'g'), separator)
    .replace(/\W/g, separator)
    .replace(edge, '')
    .replace(repeat, separator)
    .toLowerCase();
};
