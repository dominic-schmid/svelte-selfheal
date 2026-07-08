import { articles, healArticle, healer } from './fixtures.js';
import { describe, expect, it } from 'vitest';

describe('stack', () => {
  it('serves without redirect when every heal layer is already canonical', async () => {
    const result = await healer.stack([
      healArticle('the-article-title-1'),
      'details',
      healArticle('the-article-title-1')
    ]);

    expect(result).toEqual({
      notFound: false,
      redirect: null,
      resources: [articles[0], articles[0]]
    });
  });

  it('reports notFound when any heal layer fetch fails', async () => {
    const result = await healer.stack([healArticle('missing-999')]);

    expect(result).toEqual({ notFound: true });
  });

  it('redirects when a parent slug is wrong on a nested route', async () => {
    const result = await healer.stack([
      healArticle('why-did-thore-4'),
      'details',
      healArticle('why-did-the-chicken-cross-the-road-and-more-4')
    ]);

    expect(result.notFound).toBe(false);
    if (!result.notFound) {
      expect(result.redirect).toBe(
        '/why-did-the-chicken-cross-the-road-and-more-4/details/why-did-the-chicken-cross-the-road-and-more-4'
      );
    }
  });

  it('redirects when every heal layer slug is wrong', async () => {
    const result = await healer.stack([
      healArticle('wrong-parent-4'),
      'details',
      healArticle('wrong-inner-4')
    ]);

    expect(result.notFound).toBe(false);
    if (!result.notFound) {
      expect(result.redirect).toBe(
        '/why-did-the-chicken-cross-the-road-and-more-4/details/why-did-the-chicken-cross-the-road-and-more-4'
      );
    }
  });

  it('preserves search params on a nested redirect', async () => {
    const result = await healer.stack(
      [healArticle('wrong-1'), 'details', healArticle('also-wrong-1')],
      new URLSearchParams({ ref: 'x' })
    );

    expect(result.notFound).toBe(false);
    if (!result.notFound) {
      expect(result.redirect).toBe('/the-article-title-1/details/the-article-title-1?ref=x');
    }
  });
});
