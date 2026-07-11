import { createSeparatorHandler } from './create-separator-handler.js';

/**
 * Hyphen-separated identifier handler (`slug-id`).
 *
 * Limitation: identifiers must not contain `-` (use {@link TildeIdentifierHandler} for UUIDs).
 *
 * @example
 * HyphenIdentifierHandler.join('my-post', 42) // 'my-post-42'
 */
export const HyphenIdentifierHandler = createSeparatorHandler('-');
