import type { IdentifierHandler, RouteComparator, SlugSanitizer } from './types/strategies.js';

/**
 * Default slug sanitizer: NFKD diacritic folding, kebab-case, underscore removal,
 * consecutive hyphen collapse, and lowercase.
 *
 * @example
 * KebabSlugSanitizer('Hello World!') // 'hello-world'
 * KebabSlugSanitizer('cliché café') // 'cliche-cafe'
 */
export const KebabSlugSanitizer: SlugSanitizer = (slug) => {
  return slug
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/_/g, '-')
    .replace(/\W/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-')
    .toLowerCase();
};

/** Strict string equality comparator for canonical vs actual routes. */
export const NamedComparator: RouteComparator = (expected, actual) => {
  return expected === actual;
};

/**
 * Hyphen-separated identifier handler (`slug-id`).
 *
 * Limitation: identifiers must not contain `-` (UUIDs with hyphens need a custom handler).
 *
 * @example
 * HyphenIdentifierHandler.join('my-post', 42) // 'my-post-42'
 * HyphenIdentifierHandler.separate('my-post-42') // { slug: 'my-post', identifier: '42' }
 */
export const HyphenIdentifierHandler: IdentifierHandler = {
  join: (slug, identifier) => {
    const id = String(identifier);
    if (slug === '') return id;
    return `${slug}-${id}`;
  },
  separate: (slug) => {
    const separatorIndex = slug.lastIndexOf('-');
    if (separatorIndex === -1) {
      return { identifier: slug, slug: '' };
    }
    return {
      identifier: slug.slice(separatorIndex + 1),
      slug: slug.slice(0, separatorIndex)
    };
  }
};
