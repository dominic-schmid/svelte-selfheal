import { healer } from './fixtures.js';
import { describe, expect, it } from 'vitest';

describe('canonicalRedirect', () => {
  it('returns no redirect when the route param is already canonical', () => {
    expect(
      healer.canonicalRedirect([
        { param: 'the-article-title-1', identifier: 1, slug: 'The article title' }
      ])
    ).toBeNull();
  });

  it('returns a redirect path when the slug is wrong but the id matches', () => {
    expect(
      healer.canonicalRedirect([
        { param: 'wrong-slug-1', identifier: 1, slug: 'The article title' }
      ])
    ).toBe('/the-article-title-1');
  });

  it('redirects an id-only param to the titled canonical path', () => {
    expect(
      healer.canonicalRedirect([{ param: '1', identifier: 1, slug: 'The article title' }])
    ).toBe('/the-article-title-1');
  });

  it('returns no redirect for id-only params when the resource has no title', () => {
    expect(healer.canonicalRedirect([{ param: '123', identifier: 123, slug: '' }])).toBeNull();
  });

  it('preserves search params on the redirect path', () => {
    expect(
      healer.canonicalRedirect(
        [{ param: 'wrong-slug-2', identifier: 2, slug: 'Another article' }],
        new URLSearchParams({ ref: 'newsletter' })
      )
    ).toBe('/another-article-2?ref=newsletter');
  });

  it('returns no redirect when the param and search params already match', () => {
    expect(
      healer.canonicalRedirect(
        [{ param: 'another-article-2', identifier: 2, slug: 'Another article' }],
        new URLSearchParams({ ref: 'newsletter' })
      )
    ).toBeNull();
  });
});

describe('canonicalRedirect on composed paths', () => {
  it('redirects every heal segment while keeping static literals', () => {
    expect(
      healer.canonicalRedirect([
        { param: 'wrong-42', identifier: 42, slug: 'Parent Title' },
        'details',
        { param: 'wrong-1', identifier: 1, slug: 'The article title' }
      ])
    ).toBe('/parent-title-42/details/the-article-title-1');
  });

  it('returns no redirect when every heal segment is already canonical', () => {
    expect(
      healer.canonicalRedirect([
        { param: 'parent-title-42', identifier: 42, slug: 'Parent Title' },
        'details',
        { param: 'the-article-title-1', identifier: 1, slug: 'The article title' }
      ])
    ).toBeNull();
  });

  it('preserves search params when multiple heal segments redirect', () => {
    expect(
      healer.canonicalRedirect(
        [
          { param: 'wrong-42', identifier: 42, slug: 'Parent Title' },
          'details',
          { param: '1', identifier: 1, slug: 'The article title' }
        ],
        new URLSearchParams({ ref: 'x' })
      )
    ).toBe('/parent-title-42/details/the-article-title-1?ref=x');
  });
});

describe('identifier round-trip', () => {
  it('recovers the identifier from a canonical URL built by createUrl', () => {
    expect(healer.parseId(healer.createUrl(42, 'My Fancy Title'))).toBe('42');
  });
});
