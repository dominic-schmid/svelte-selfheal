import type { SlugSanitizer } from '../../types/strategies.js';
import { normalizeSlugBase } from './normalize-base.js';

/**
 * Snake_case slug sanitizer — same normalization as kebab, joined with `_`.
 *
 * @example
 * SnakeSlugSanitizer('Hello World!') // 'hello_world'
 */
export const SnakeSlugSanitizer: SlugSanitizer = (slug) => normalizeSlugBase(slug, '_');
