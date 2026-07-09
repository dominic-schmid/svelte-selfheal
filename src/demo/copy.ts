import { siteLinks } from './site.js';

export const customizeExplainer = {
  title: 'Defaults',
  lead: 'Hyphen IDs and kebab slugs out of the box. Pass identifier and sanitize to selfheal() when your routes use something else.'
};

/** Landing page copy — keep in one place for tone and order. */
export const lander = {
  hero: '/the-article-title-1 looks right in Google. Your load still fetches article 1. Break the slug and you get a 301 to whatever title you have now.',
  try: 'Click one and watch the address bar.',
  setup:
    'Define healArticle once. run() or stack() in load parses the param, fetches your row, compares the slug. Canonical URL? One fetch, typed Article (or a tuple for nested routes) in result.resources. Off slug? redirect(301) before the page renders. You call error() and redirect().',
  how: 'parseId() from the param, fetch by ID, build the canonical slug, compare. Mismatch sends a 301.',
  inspirationTitle: 'Where this comes from',
  inspirationLead:
    'walked through self-healing URLs on Laravel — pretty slug, stable ID at the end, 301 when the slug rots.',
  inspirationShout:
    "Also, at this point: shoutout Aaron for all the cool shit he's put out. This repo wouldn't exist without that video."
} as const;

const githubDefaults = siteLinks.defaultsTree;

export const strategyGroups = [
  {
    step: 1,
    title: 'Parse ID',
    when: 'identifier.separate(param) in parseId()',
    github: `${githubDefaults}/identifier-handlers`,
    moreLabel: 'identifier handlers',
    footNote: 'Different separator? Plug in your own handler.',
    preview: [
      {
        name: 'HyphenIdentifierHandler',
        default: true,
        example: 'my-article-title-1 → id 1'
      },
      {
        name: 'TildeIdentifierHandler',
        default: false,
        example: 'my-article~a1b2-c3d4 → id a1b2-c3d4'
      }
    ]
  },
  {
    step: 2,
    title: 'Build canonical',
    when: 'sanitize(slug) + identifier.join() in createUrl()',
    github: `${githubDefaults}/slug-sanitizers`,
    moreLabel: 'slug sanitizers',
    footNote: 'Not kebab-case? Pass your own sanitizer.',
    preview: [
      {
        name: 'KebabSlugSanitizer',
        default: true,
        example: '"My Fancy Title" → my-fancy-title'
      },
      {
        name: 'SnakeSlugSanitizer',
        default: false,
        example: '"My Fancy Title" → my_fancy_title'
      }
    ]
  }
] as const;

/** Landing setup examples — filenames shown via figcaption, not inline comments. */
export const setupSnippets = {
  healerSimple: `import { selfheal } from 'svelte-selfheal';
import { getArticle } from '$lib/db/articles.js';

export const healer = selfheal();

export const healArticle = healer.layer({
  fetch: getArticle,
  segment: (article) => ({ identifier: article.id, slug: article.title })
});`,
  healerNested: `import { selfheal } from 'svelte-selfheal';
import { getArticle } from '$lib/db/articles.js';
import { getAuthor } from '$lib/db/authors.js';

export const healer = selfheal();

export const healArticle = healer.layer({
  fetch: getArticle,
  segment: (article) => ({ identifier: article.id, slug: article.title })
});

export const healAuthor = healer.layer({
  fetch: getAuthor,
  segment: (author) => ({ identifier: author.id, slug: author.name })
});`,
  runLoad: `import { healArticle, healer } from '$lib/healer.js';
import { error, redirect } from '@sveltejs/kit';

export const load = async ({ params, url }) => {
  const result = await healer.run(healArticle(params.id), url.searchParams);
  if (result.notFound) error(404, 'Article not found');
  if (result.redirect) redirect(301, result.redirect);

  const [article] = result.resources;
  return { article };
};`,
  stackLoad: `import { healArticle, healAuthor, healer } from '$lib/healer.js';
import { error, redirect } from '@sveltejs/kit';

export const load = async ({ params, url }) => {
  const result = await healer.stack(
    [healArticle(params.id), 'details', healAuthor(params.innerId)],
    url.searchParams
  );
  if (result.notFound) error(404, 'Not found');
  if (result.redirect) redirect(301, result.redirect);

  const [article, author] = result.resources;
  return { article, author };
};`
} as const;

export const setupFilenames = {
  healer: 'src/lib/healer.ts',
  runLoad: 'src/routes/[id]/+page.server.ts',
  stackLoad: 'src/routes/[id]/details/[innerId]/+page.server.ts'
} as const;

export const landerSeo = {
  title: 'svelte-selfheal — Self-healing URLs for SvelteKit',
  description:
    'SvelteKit load helper: fetch by ID, 301 wrong slugs to the canonical path. Zero runtime deps.',
  ogDescription: 'Fetch by ID, 301 wrong slugs to the canonical path.',
  ogImageAlt: 'svelte-selfheal demo — wrong slugs redirect to the canonical URL'
} as const;
