import { createSeparatorHandler } from './create-separator-handler.js';

/**
 * Underscore-separated identifier handler (`slug_id`).
 *
 * @example
 * UnderscoreIdentifierHandler.join('my-post', 42) // 'my-post_42'
 */
export const UnderscoreIdentifierHandler = createSeparatorHandler('_');
