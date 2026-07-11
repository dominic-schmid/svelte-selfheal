import type { IdentifierHandler } from '../../types/strategies.js';

/** Builds join/separate handlers for a fixed separator string. */
export const createSeparatorHandler = (separator: string): IdentifierHandler => ({
  join: (slug, identifier) => {
    const id = String(identifier);
    if (slug === '') return id;
    return `${slug}${separator}${id}`;
  },
  separate: (param) => {
    const index = param.lastIndexOf(separator);
    if (index === -1) return { identifier: param, slug: '' };
    return { identifier: param.slice(index + 1), slug: param.slice(0, index) };
  }
});
