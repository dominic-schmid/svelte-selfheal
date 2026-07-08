import type { SlugSanitizer } from '../../types/strategies.js';
import { normalizeSlugBase } from './normalize-base.js';

/**
 * Default slug sanitizer: NFKD diacritic folding, kebab-case, underscore removal,
 * consecutive hyphen collapse, and lowercase.
 *
 * @example
 * KebabSlugSanitizer('Hello World!') // 'hello-world'
 * KebabSlugSanitizer('cliché café') // 'cliche-cafe'
 */
export const KebabSlugSanitizer: SlugSanitizer = (slug) => normalizeSlugBase(slug, '-');
