import { createSeparatorHandler } from './create-separator-handler.js';

/**
 * Tilde-separated identifier handler (`slug~id`) — safe for hyphenated UUIDs.
 *
 * @example
 * TildeIdentifierHandler.join('my-post', '550e8400-e29b-41d4-a716-446655440000')
 * // 'my-post~550e8400-e29b-41d4-a716-446655440000'
 */
export const TildeIdentifierHandler = createSeparatorHandler('~');
