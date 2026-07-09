import { healer } from './healer.js';

export type ExampleId = 'simple' | 'nested';

export interface ExampleTab {
  id: ExampleId;
  label: string;
  tagline: string;
}

const article = { id: 1, title: 'The article title' };
const author = { id: 2, name: 'Jane Doe' };
const articleSlug = healer.createUrl(article.id, article.title);
const authorSlug = healer.createUrl(author.id, author.name);

export const exampleTabs: ExampleTab[] = [
  {
    id: 'simple',
    label: 'Simple',
    tagline: 'healer.run()'
  },
  {
    id: 'nested',
    label: 'Nested',
    tagline: 'healer.stack()'
  }
];

const canonicalFor = (id: ExampleId): string =>
  id === 'simple' ? articleSlug : `${articleSlug}/details/${authorSlug}`;

export type TryBadge = 'canonical' | '301' | '404';

export interface TryLink {
  href: string;
  label: string;
  badge: TryBadge;
  ok: boolean;
}

export const tryBadgeLabel: Record<TryBadge, string> = {
  canonical: 'canonical',
  '301': '301',
  '404': '404'
};

const wrongSlug = (canonical: string): string => canonical.replace(/^(.*?)-/, 'wrong-spelling-');

export const tryLinksFor = (id: ExampleId): TryLink[] => {
  if (id === 'simple') {
    return [
      { href: `/${articleSlug}`, label: `/${articleSlug}`, badge: 'canonical', ok: true },
      {
        href: `/wrong-spelling-article-title-1`,
        label: '/wrong-spelling-article-title-1',
        badge: '301',
        ok: false
      },
      { href: '/1', label: '/1', badge: '301', ok: false },
      { href: '/THIS-is-WRONG-1', label: '/THIS-is-WRONG-1', badge: '301', ok: false },
      {
        href: '/missing-article-99999',
        label: '/missing-article-99999',
        badge: '404',
        ok: false
      }
    ];
  }

  const parentWrong = wrongSlug(articleSlug);
  const childWrong = wrongSlug(authorSlug);
  const canonical = `/${articleSlug}/details/${authorSlug}`;

  return [
    { href: canonical, label: canonical, badge: 'canonical', ok: true },
    {
      href: `/${parentWrong}/details/${authorSlug}`,
      label: `/${parentWrong}/details/${authorSlug}`,
      badge: '301',
      ok: false
    },
    {
      href: `/${articleSlug}/details/${childWrong}`,
      label: `/${articleSlug}/details/${childWrong}`,
      badge: '301',
      ok: false
    },
    {
      href: `/${parentWrong}/details/${childWrong}`,
      label: `/${parentWrong}/details/${childWrong}`,
      badge: '301',
      ok: false
    },
    { href: '/1/details/2', label: '/1/details/2', badge: '301', ok: false }
  ];
};

export const canonicalDisplay = (id: ExampleId): string => `/${canonicalFor(id)}`;
