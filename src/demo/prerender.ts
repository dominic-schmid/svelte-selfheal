import { tryLinksFor } from './examples.js';

const stripLeadingSlash = (href: string): string => href.replace(/^\//, '');

export const simpleRouteEntries = (): { id: string }[] =>
  tryLinksFor('simple').map((link) => ({ id: stripLeadingSlash(link.href) }));

export const nestedRouteEntries = (): { id: string; innerId: string }[] =>
  tryLinksFor('nested').map((link) => {
    const parts = link.href.split('/').filter(Boolean);
    const parent = parts[0];
    const child = parts[2];
    if (!parent || !child) throw new Error(`Invalid nested demo path: ${link.href}`);
    return { id: parent, innerId: child };
  });
