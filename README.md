# svelte-selfheal

A simple Svelte package inspired by [this video from Aaron Francis](https://www.youtube.com/watch?v=a6lnfyES-LA) and heavily based on [a similar package for Laravel](https://github.com/lukeraymonddowning/self-healing-urls).

It allows you to redirect users to a canonical and SEO-friendly URL for a page, even if the slug is altered at any point or doesn't exist at all.

![svelte-selfheal-gif](./static/svelte-selfheal.gif)

### Example

Canonical URL: `https://my-app.com/blog/5312_my-fancy-title`

The following URLs would still redirect to the correct page:

- `/blog/5312_my-fancy-title` _(original)_
- `/blog/5312_my-fancy-but-spelled-wrong-title`
- `/blog/5312_`
- `/blog/5312`
- `/blog/5312_THIS should NOT be r3alURL`

## Installation

Install this package using any of the popular package managers.

```bash
npm i svelte-selfheal
```

```bash
pnpm add svelte-selfheal
```

```bash
yarn add svelte-selfheal
```

## Quick Start

The API is designed for zero-configuration usage with **excellent developer experience**:

### ✨ **Super Simple API - One Function Call**

```ts
import { Healer } from 'svelte-selfheal';

const healer = new Healer();

// Everything in one call - parse, fetch, validate, redirect
export const load: PageServerLoad = async ({ params, url }) => {
	return healer.handleRoute({
		slug: params.id,
		searchParams: url.searchParams,
		fetcher: async (id) => {
			const article = await getArticle(id);
			return article ? { entity: article, slug: article.title } : null;
		},
		onNotFound: () => error(404, 'Article not found'),
		transform: (article) => ({ article })
	});
};
```

### 🚀 **Manual Control - Step by Step**

```ts
import { Healer } from 'svelte-selfheal';

const healer = new Healer();

export const load: PageServerLoad = async ({ params, url }) => {
	// Extract ID from URL like "123_my-article"
	const id = healer.extractId(params.slug);

	// Get your data
	const article = await getArticle(id);
	if (!article) throw error(404, 'Article not found');

	// Validate and redirect if needed
	healer.validateAndRedirect({
		entity: { id: article.id, slug: article.title },
		currentSlug: params.slug,
		searchParams: url.searchParams
	});

	return { article };
};
```

## Core Concepts

### Default Behavior

By default, `svelte-selfheal` creates URLs with the format `id_slug`:

```ts
const healer = new Healer();
healer.createUrl('123', 'My Article Title'); // → "123_my-article-title"
```

**Key defaults:**

- **Separator**: Underscore (`_`) - safe, doesn't conflict with UUIDs or most ID formats
- **Order**: ID first (`id_slug`) - ensures ID is always at the beginning for reliable parsing
- **Sanitizer**: Unicode - handles international characters by removing diacritics
- **Character replacements**: Enabled - converts `&` to "and", `@` to "at", etc.

### Healer Class

The `Healer` class is the core of svelte-selfheal. It handles URL creation, ID parsing, and validation.

```ts
import { Healer, sanitizers, separators } from 'svelte-selfheal';

const healer = new Healer({
	sanitizer: sanitizers.unicode, // How to clean text (default)
	separator: separators.underscore, // How to join id_slug (default)
	order: 'id-first', // id_slug vs slug_id (default)
	replacements: { replaceAmpersands: true } // Character replacements
});
```

### Built-in Libraries

#### Sanitizers

Clean and format text for URLs:

```ts
import { sanitizers } from 'svelte-selfheal';

// Available sanitizers:
sanitizers.unicode; // Default: "Café & Co!" → "cafe-co"
sanitizers.simple; // Gentle: "Café & Co!" → "cafe-and-co"
sanitizers.preserve; // Minimal: "Café & Co!" → "café-&-co"
```

#### Separators

Control how ID and slug are joined:

```ts
import { separators } from 'svelte-selfheal';

// Available separators:
separators.underscore; // "123_my-article" (default, safe choice)
separators.dot; // "123.my-article" (collision-free with UUIDs)
separators.tilde; // "123~my-article" (alternative option)
```

**Important limitation**: If your IDs contain the separator character, URL parsing may fail. For example, if using dot separator with UUID-like IDs that contain dots, or underscore separator with IDs containing underscores. Choose your separator based on your ID format.

### Character Replacements

Fine-tune character handling with the replacement system:

```ts
const healer = new Healer({
	replacements: {
		replaceDots: true, // . → - (default: true)
		replaceAmpersands: true, // & → " and " (default: true)
		replaceAtSigns: true, // @ → " at " (default: true)
		replacePlus: true, // + → " plus " (default: true)
		replaceUnderscores: true, // _ → - (default: true)
		replaceSpaces: true, // spaces → - (default: true)
		customReplacements: {
			'#': ' hash ',
			'%': ' percent '
		}
	}
});
```

## Core Methods

### `createUrl(id, slug, searchParams?)`

Creates a clean, SEO-friendly URL from an ID and slug text:

```ts
const healer = new Healer();

healer.createUrl('123', 'My Article Title');
// → "123_my-article-title"

healer.createUrl('user:123/org:456', 'Dashboard');
// → "user%3A123%2Forg%3A456_dashboard"

// With search parameters
const params = new URLSearchParams({ page: '2' });
healer.createUrl('123', 'Article', params);
// → "123_article?page=2"
```

### `extractId(slug)`

Extracts the original ID from a URL slug:

```ts
healer.extractId('123_my-article-title'); // → "123"
healer.extractId('user%3A123%2Forg%3A456_dashboard'); // → "user:123/org:456"
healer.extractId('123'); // → "123" (no separator found)
```

### `tryExtractId(slug)`

Safely extracts ID without throwing errors:

```ts
healer.tryExtractId('123_valid-slug'); // → "123"
healer.tryExtractId('malformed-input'); // → "malformed-input"
healer.tryExtractId(''); // → null
```

### `isCanonical(expected, actual)`

Checks if a URL slug is in its canonical form:

```ts
const canonical = healer.createUrl('123', 'My Article');
healer.isCanonical(canonical, '123_my-article'); // → true
healer.isCanonical(canonical, '123_wrong-title'); // → false
```

### `validateAndRedirect(options)`

Validates the current URL and redirects if needed:

```ts
healer.validateAndRedirect({
	entity: { id: '123', slug: 'My Article' },
	currentSlug: params.slug,
	searchParams: url.searchParams // Preserved in redirect
});
// Throws 301 redirect if currentSlug doesn't match canonical form
```

### `handleRoute(config)` - High-Level Workflow

Manages the entire URL healing workflow in one call:

```ts
export const load: PageServerLoad = async ({ params, url }) => {
	return healer.handleRoute({
		slug: params.id,
		searchParams: url.searchParams,
		fetcher: async (id) => {
			const article = await getArticle(id);
			return article ? { entity: article, slug: article.title } : null;
		},
		onNotFound: () => error(404, 'Article not found'),
		transform: (article) => ({ article, meta: 'additional data' })
	});
};
```

## Advanced Configuration

### Custom Sanitizers

Create your own text cleaning logic:

```ts
const customSanitizer = (input: string) => {
	return input
		.toLowerCase()
		.replace(/[^a-z0-9\s-]/g, '') // Remove special chars
		.replace(/\s+/g, '-') // Spaces to hyphens
		.replace(/-{2,}/g, '-'); // Condense hyphens
};

const healer = new Healer({
	sanitizer: customSanitizer
});
```

### Custom Separators

Define how IDs and slugs are joined:

```ts
import { createSeparator } from 'svelte-selfheal';

// Simple character separator
const pipeSeparator = createSeparator('|'); // "123|my-article"

// Complex custom separator
const customSeparator = {
	join: (id: string, slug: string) => {
		return slug ? `${id}::${slug}` : id;
	},
	separate: (combined: string) => {
		const lastIndex = combined.lastIndexOf('::');
		if (lastIndex === -1) return { slug: '', id: combined };
		return {
			slug: combined.substring(lastIndex + 2),
			id: combined.substring(0, lastIndex)
		};
	}
};

const healer = new Healer({
	separator: customSeparator
});
```

### Combining Replacements with Custom Sanitizers

Replacements run first, then your sanitizer:

```ts
const healer = new Healer({
	sanitizer: (input) => input.toUpperCase().replace(/\s+/g, '_'),
	replacements: {
		replaceAmpersands: true,
		customReplacements: { '#': ' hash ' }
	}
});

// "Hello & World #1" → "HELLO_AND_WORLD_HASH_1"
```

### URL Structure Options

```ts
// Default: id_slug format
const healer = new Healer();
healer.createUrl('123', 'My Article'); // → "123_my-article"

// Reversed: slug_id format
const reversedHealer = new Healer({ order: 'id-last' });
reversedHealer.createUrl('123', 'My Article'); // → "my-article_123"
```

## TypedHealer for Complex IDs

For complex ID types beyond strings:

```ts
import { TypedHealer } from 'svelte-selfheal';

interface CompositeId {
	userId: string;
	orgId: string;
}

const healer = new TypedHealer<CompositeId>({
	idEncoder: (id) => `${id.userId}@${id.orgId}`,
	idDecoder: (encoded) => {
		const [userId, orgId] = encoded.split('@');
		return { userId, orgId };
	}
});

const url = healer.createUrl({ userId: '123', orgId: '456' }, 'Dashboard');
// → "123%40456_dashboard"

const id = healer.extractId(url); // { userId: '123', orgId: '456' }
```

## Complete Example

```ts
// lib/healer.ts
import { Healer, sanitizers, separators } from 'svelte-selfheal';

export const healer = new Healer({
	sanitizer: sanitizers.simple,
	separator: separators.dot,
	order: 'id-last',
	replacements: {
		customReplacements: { '@': ' at ' }
	}
});

// routes/blog/[slug]/+page.server.ts
import { healer } from '$lib/healer.js';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types.js';

export const load: PageServerLoad = async ({ params, url }) => {
	return healer.handleRoute({
		slug: params.slug,
		searchParams: url.searchParams,
		fetcher: async (id) => {
			const article = await db.articles.findById(id);
			return article ? { entity: article, slug: article.title } : null;
		},
		onNotFound: () => error(404, 'Article not found'),
		transform: (article) => ({ article })
	});
};
```

## URL Parsing Limitations

**Separator Character Conflicts**: If your IDs contain the separator character, URL parsing will fail catastrophically. The most common example is using UUIDv4 with a hyphen separator:

```ts
// ❌ GUARANTEED FAILURE: UUIDv4 with hyphen separator
import { createSeparator } from 'svelte-selfheal';

const hyphenSeparator = createSeparator('-');
const healer = new Healer({ separator: hyphenSeparator });

const uuid = 'f47ac10b-58cc-4372-a567-0e02b2c3d479'; // Standard UUIDv4
healer.createUrl(uuid, 'My Article'); // → "f47ac10b-58cc-4372-a567-0e02b2c3d479-my-article"
healer.extractId('f47ac10b-58cc-4372-a567-0e02b2c3d479-my-article');
// → "0e02b2c3d479" (WRONG! Only gets the last part after final hyphen)
```

**More Examples of Problematic Combinations:**

```ts
// ❌ Dot separator with dotted IDs
const healer = new Healer({ separator: separators.dot });
healer.createUrl('1.2.3', 'test'); // → "1.2.3.test"
healer.extractId('1.2.3.test'); // → "test" (incorrect!)

// ❌ Underscore separator with underscore-containing IDs
const healer2 = new Healer({ separator: separators.underscore });
healer2.createUrl('user_123_admin', 'dashboard'); // → "user_123_admin_dashboard"
healer2.extractId('user_123_admin_dashboard'); // → "dashboard" (incorrect!)

// ✅ SAFE: Choose separators that don't appear in your IDs
const safeHealer = new Healer({ separator: separators.tilde }); // ~ rarely used in IDs
safeHealer.createUrl('f47ac10b-58cc-4372-a567-0e02b2c3d479', 'article');
// → "f47ac10b-58cc-4372-a567-0e02b2c3d479~article"
safeHealer.extractId('f47ac10b-58cc-4372-a567-0e02b2c3d479~article');
// → "f47ac10b-58cc-4372-a567-0e02b2c3d479" (correct!)
```

**Why This Happens**: The library uses `lastIndexOf()` to find separators and splits at the rightmost occurrence. This means if your ID contains the separator character, the library will incorrectly identify an internal separator as the ID/slug boundary.

**Solution**: Always choose a separator character that will never appear in your ID format. For UUIDs, use `~` or `_`. For numeric IDs, any separator is usually safe.

## Length-Prefixed Separator (Advanced Solution)

For cases where you **cannot** control the ID format and **must** use a separator that appears in your IDs, the library provides a length-prefixed separator that guarantees conflict resolution:

```ts
import { Healer, createLengthPrefixedSeparator } from 'svelte-selfheal';

// ✅ 100% RELIABLE: Works with any ID format
const healer = new Healer({
	separator: createLengthPrefixedSeparator('-'),
	order: 'id-first' // Order is configurable, defaults to 'id-first'
});

const uuid = 'f47ac10b-58cc-4372-a567-0e02b2c3d479'; // Contains hyphens
healer.createUrl(uuid, 'My Article');
// → "36-f47ac10b-58cc-4372-a567-0e02b2c3d479-my-article"
//    ↑  ↑                                      ↑
//   len ID (36 chars)                        slug

healer.extractId('36-f47ac10b-58cc-4372-a567-0e02b2c3d479-my-article');
// → "f47ac10b-58cc-4372-a567-0e02b2c3d479" (CORRECT!)
```

**How It Works**: The length-prefixed format uses `{length}-{first}-{second}` where:

- `length` = exact character count of the first element
- `first` = either ID or slug (depending on configured order)
- `second` = either slug or ID (depending on configured order)

The order follows your Healer configuration (`id-first` or `id-last`) and is automatically passed to the separator function.

**Examples**:

```ts
// Default order: id-first (ID comes first in URL)
const healer = new Healer({
	separator: createLengthPrefixedSeparator('-'),
	order: 'id-first' // This is the default
});

healer.createUrl('user-123-admin', 'Dashboard Page');
// → "13-user-123-admin-dashboard-page"
//    ↑  ↑               ↑
//   len ID (13 chars)  slug

// Custom order: id-last (slug comes first in URL)
const idLastHealer = new Healer({
	separator: createLengthPrefixedSeparator('-'),
	order: 'id-last'
});

idLastHealer.createUrl('user-123-admin', 'Dashboard Page');
// → "14-dashboard-page-user-123-admin"
//    ↑  ↑             ↑
//   len slug (14)     ID

// Works with any separator character
const pipeHealer = new Healer({ separator: createLengthPrefixedSeparator('|') });
pipeHealer.createUrl('a|b|c', 'test'); // → "5|a|b|c|test"

// Graceful fallback for non-length-prefixed URLs
healer.extractId('regular-url-format'); // → "regular" (falls back to regular parsing)
```

### Trade-offs

**✅ Advantages:**

- **100% reliable** - works with any ID format
- **Conflict-free** - no separator character limitations
- **Backward compatible** - gracefully handles non-length-prefixed URLs

**❌ Disadvantages:**

- **Less human-readable** - URLs like `36-f47ac10b-58cc-4372-a567-0e02b2c3d479-article`
- **Slightly longer** - adds length prefix overhead
- **More complex** - harder to manually construct/read URLs

**Technical Note**: The `createLengthPrefixedSeparator()` function creates a separator that receives the `order` parameter from the Healer class configuration. This allows the same separator to work correctly with both `id-first` and `id-last` configurations.

**Recommendation**: Only use length-prefixed separators when you have no control over ID format and regular separators fail. For most use cases, choosing a safe separator character (`~`, `_`) is simpler and more user-friendly.

## TypeScript Support

Full TypeScript support with proper generics:

```ts
import type { HealerConfig, TypedHealerConfig, SanitizerFn, SeparatorFn } from 'svelte-selfheal';

// Custom configuration with type safety
const config: HealerConfig = {
	sanitizer: sanitizers.unicode,
	separator: separators.dot,
	order: 'id-first'
};
```

## License

Licensed under the [MIT license](https://github.com/dominic-schmid/svelte-selfheal/blob/main/LICENSE.md).
