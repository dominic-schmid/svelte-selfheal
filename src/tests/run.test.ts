import { articles, healArticle, healer } from './fixtures.js';
import { describe, expect, it } from 'vitest';

describe('run', () => {
  it('serves without redirect when the route param is already canonical', async () => {
    const result = await healer.run(healArticle('the-article-title-1'));

    expect(result).toEqual({
      notFound: false,
      redirect: null,
      resources: [articles[0]]
    });
  });

  it('redirects a wrong slug to the canonical path', async () => {
    const result = await healer.run(healArticle('wrong-slug-1'));

    expect(result.notFound).toBe(false);
    if (!result.notFound) {
      expect(result.redirect).toBe('/the-article-title-1');
      expect(result.resources).toEqual([articles[0]]);
    }
  });

  it('redirects an id-only URL to the titled canonical path', async () => {
    const result = await healer.run(healArticle('1'));

    expect(result.notFound).toBe(false);
    if (!result.notFound) {
      expect(result.redirect).toBe('/the-article-title-1');
    }
  });

  it('leaves an id-only URL canonical when the resource has no title', async () => {
    const result = await healer.run(healArticle('123'));

    expect(result).toEqual({
      notFound: false,
      redirect: null,
      resources: [articles[2]]
    });
  });

  it('reports notFound when the identifier does not resolve', async () => {
    const result = await healer.run(healArticle('missing-999'));

    expect(result).toEqual({ notFound: true });
  });

  it('preserves search params on redirect', async () => {
    const result = await healer.run(
      healArticle('wrong-slug-2'),
      new URLSearchParams({ ref: 'newsletter' })
    );

    expect(result.notFound).toBe(false);
    if (!result.notFound) {
      expect(result.redirect).toBe('/another-article-2?ref=newsletter');
    }
  });
});
