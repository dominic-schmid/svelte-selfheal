import {
  CaseInsensitiveComparator,
  HyphenIdentifierHandler,
  KebabSlugSanitizer,
  NamedComparator,
  PassthroughSlugSanitizer,
  selfheal,
  SnakeSlugSanitizer,
  TildeIdentifierHandler,
  UnderscoreIdentifierHandler
} from '$lib/index.js';
import { healer } from './fixtures.js';
import { describe, expect, it } from 'vitest';

describe('default healer URL building', () => {
  it('builds a canonical param from a messy title and identifier', () => {
    expect(healer.createUrl(123, 'An unformatted SLUG')).toBe('an-unformatted-slug-123');
  });

  it('appends search params to the canonical param', () => {
    const params = new URLSearchParams({ test: 'true', numbers: '999' });
    expect(healer.createUrl(123, 'An unformatted SLUG', params)).toBe(
      'an-unformatted-slug-123?test=true&numbers=999'
    );
  });

  it('parses the identifier back out of a canonical param', () => {
    expect(healer.parseId('an-unformatted-slug-123')).toBe('123');
  });

  it('treats an empty param as an empty identifier', () => {
    expect(healer.parseId('')).toBe('');
  });

  it('accepts a matching route param without redirecting', () => {
    expect(healer.validate('an-unformatted-slug-123', 'an-unformatted-slug-123')).toBe(true);
  });

  it('rejects a mismatched route param', () => {
    expect(healer.validate('an-unformatted-slug-123', 'wrong-slug-123')).toBe(false);
  });

  it('includes search params when comparing route params', () => {
    const params = new URLSearchParams({ test: 'true' });
    expect(
      healer.validate('an-unformatted-slug-123?test=true', 'an-unformatted-slug-123', params)
    ).toBe(true);
  });
});

describe('custom healer strategies', () => {
  it('uses UnderscoreIdentifierHandler when configured', () => {
    const custom = selfheal({ identifier: UnderscoreIdentifierHandler });

    expect(custom.createUrl(7, 'My Post')).toBe('my-post_7');
    expect(custom.parseId('my-post_7')).toBe('7');
  });

  it('uses TildeIdentifierHandler for hyphenated UUIDs', () => {
    const custom = selfheal({ identifier: TildeIdentifierHandler });
    const uuid = '550e8400-e29b-41d4-a716-446655440000';

    expect(custom.createUrl(uuid, 'My Post')).toBe(`my-post~${uuid}`);
    expect(custom.parseId(`my-post~${uuid}`)).toBe(uuid);
  });

  it('uses CaseInsensitiveComparator when configured', () => {
    const custom = selfheal({ isEqual: CaseInsensitiveComparator });

    expect(custom.validate('My-Post-1', 'my-post-1')).toBe(true);
  });
});

describe('KebabSlugSanitizer export', () => {
  it('lowercases input', () => {
    expect(KebabSlugSanitizer('AN UPPERCASE SLUG')).toBe('an-uppercase-slug');
  });

  it.each([
    { input: 'any given slug', expected: 'any-given-slug' },
    { input: 'any--given------slug-123', expected: 'any-given-slug-123' },
    { input: '-any-given-slug-', expected: 'any-given-slug' },
    { input: 'cliché café', expected: 'cliche-cafe' },
    { input: 'mötörhëäd', expected: 'motorhead' },
    { input: '', expected: '' },
    { input: '   leading-trailing-whitespaces   ', expected: 'leading-trailing-whitespaces' },
    { input: '___underscores___', expected: 'underscores' },
    { input: '   multiple   spaces   ', expected: 'multiple-spaces' }
  ])('sanitizes "$input" to "$expected"', ({ input, expected }) => {
    expect(KebabSlugSanitizer(input)).toBe(expected);
  });
});

describe('SnakeSlugSanitizer export', () => {
  it('sanitizes to snake_case', () => {
    expect(SnakeSlugSanitizer('Hello World!')).toBe('hello_world');
    expect(SnakeSlugSanitizer('cliché café')).toBe('cliche_cafe');
  });
});

describe('PassthroughSlugSanitizer export', () => {
  it('trims without transforming the slug', () => {
    expect(PassthroughSlugSanitizer('  Already-Clean  ')).toBe('Already-Clean');
  });
});

describe('NamedComparator export', () => {
  it.each<{ left: string; right: string; matches: boolean }>([
    { left: 'any-given-slug-123', right: 'any-given-slug-123', matches: true },
    { left: 'any-given-slug-123', right: 'any-given-slug-456', matches: false },
    { left: 'any-given-slug-123', right: 'any-given-slug-123?foo=bar', matches: false }
  ])('reports $left and $right as matching=$matches', ({ left, right, matches }) => {
    expect(NamedComparator(left, right)).toBe(matches);
  });
});

describe('CaseInsensitiveComparator export', () => {
  it('ignores casing differences', () => {
    expect(CaseInsensitiveComparator('My-Post-1', 'my-post-1')).toBe(true);
    expect(CaseInsensitiveComparator('My-Post-1', 'my-post-2')).toBe(false);
  });
});

describe('HyphenIdentifierHandler export', () => {
  it('joins slug and identifier with a hyphen', () => {
    expect(HyphenIdentifierHandler.join('any-given-slug', '123')).toBe('any-given-slug-123');
  });

  it('separates slug and identifier on the last hyphen', () => {
    expect(HyphenIdentifierHandler.separate('multiple-hyphen-test-identifier')).toEqual({
      identifier: 'identifier',
      slug: 'multiple-hyphen-test'
    });
  });

  it('produces id-only params when the slug is empty', () => {
    expect(HyphenIdentifierHandler.join('', '123')).toBe('123');
    expect(HyphenIdentifierHandler.separate('123')).toEqual({ identifier: '123', slug: '' });
  });
});

describe('UnderscoreIdentifierHandler export', () => {
  it('joins slug and identifier with an underscore', () => {
    expect(UnderscoreIdentifierHandler.join('my-post', 42)).toBe('my-post_42');
    expect(UnderscoreIdentifierHandler.separate('my-post_42')).toEqual({
      identifier: '42',
      slug: 'my-post'
    });
  });
});

describe('TildeIdentifierHandler export', () => {
  it('joins slug and identifier with a tilde', () => {
    const uuid = '550e8400-e29b-41d4-a716-446655440000';
    expect(TildeIdentifierHandler.join('my-post', uuid)).toBe(`my-post~${uuid}`);
    expect(TildeIdentifierHandler.separate(`my-post~${uuid}`)).toEqual({
      identifier: uuid,
      slug: 'my-post'
    });
  });
});
