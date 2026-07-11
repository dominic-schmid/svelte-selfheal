import type { SlugSanitizer } from '../../types/strategies.js';

/**
 * Passthrough sanitizer — trims whitespace only. Use when slugs are pre-normalized in your DB.
 *
 * @example
 * PassthroughSlugSanitizer('  already-clean  ') // 'already-clean'
 */
export const PassthroughSlugSanitizer: SlugSanitizer = (slug) => slug.trim();
