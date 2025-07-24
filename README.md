# svelte-selfheal

A simple Svelte package inspired by [this video from Aaron Francis](https://www.youtube.com/watch?v=a6lnfyES-LA) and heavily based on [a similar package for Laravel](https://github.com/lukeraymonddowning/self-healing-urls).

It allows you to redirect users to a canonical and SEO-friendly URL for a page, even if the slug is altered at any point or doesn't exist at all.

![svelte-selfheal-gif](./static/svelte-selfheal.gif)

### Example

Canonical URL: `https://my-app.com/blog/my-fancy-title.5312`

The following URLs would still redirect to the correct page:

- `/blog/my-fancy-title.5312` _(original)_
- `/blog/my-fancy-but-spelled-wrong-title.5312`
- `/blog/5312`
- `/blog/.5312`
- `/blog/THIS should NOT be r3alURL   .5312`

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

The V2 API is designed for zero-configuration usage. Just import and use:

```ts
import { Healer } from 'svelte-selfheal';

// Zero config - works immediately with smart defaults
const healer = new Healer();

// In your SvelteKit load function
export const load: PageServerLoad = async ({ params, url }) => {
	// Extract ID from URL like "my-article.123"
	const id = healer.parseId(params.slug);

	// Get your data
	const article = await getArticle(id);
	if (!article) throw error(404, 'Article not found');

	// Create canonical URL and redirect if needed
	healer.validateAndRedirect({
		entity: { id: article.id, title: article.title },
		currentSlug: params.id,
		searchParams: url.searchParams
	});

	return { article };
};
```

Or if you would like more control over each step of the healer:

```ts
import { Healer } from 'svelte-selfheal';

// Zero config - works immediately with smart defaults
const healer = new Healer();

// In your SvelteKit load function
export const load: PageServerLoad = async ({ params, url }) => {
	// Extract ID from URL like "my-article.123"
	const id = healer.parseId(params.slug);

	// Get your data
	const article = await getArticle(id);
	if (!article) throw error(404, 'Article not found');

	// Create canonical URL and redirect if needed
	const expectedUrl = healer.createUrl(article.id, article.title);
	if (!healer.validate(expectedUrl, params.slug)) {
		throw redirect(301, expectedUrl);
	}

	return { article };
};
```

## Main Concepts

### Healer Class

The `Healer` class is the core of svelte-selfheal. It handles URL creation, ID parsing, and validation.

```ts
import { Healer } from 'svelte-selfheal';

const healer = new Healer({
	sanitizer: sanitizers.unicode, // How to clean text (default)
	separator: separators.dot, // How to join slug.id (default)
	order: 'default' // slug.id vs id.slug (default)
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
sanitizers.business; // "Tech Corp Inc." → "tech"
```

#### Separators

Control how slug and ID are joined:

```ts
import { separators } from 'svelte-selfheal';

// Available separators:
separators.dot; // "my-article.123" (default, collision-free)
separators.underscore; // "my-article_123"
separators.tilde; // "my-article~123"
```

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

Define how slugs and IDs are joined:

```ts
import { createSeparator } from 'svelte-selfheal';

// Simple character separator
const pipeSeparator = createSeparator('|'); // "my-article|123"

// Complex custom separator
const customSeparator = {
	join: (slug: string, id: string) => {
		return slug ? `${slug}::${id}` : id;
	},
	separate: (combined: string) => {
		const lastIndex = combined.lastIndexOf('::');
		if (lastIndex === -1) return { slug: '', id: combined };
		return {
			slug: combined.substring(0, lastIndex),
			id: combined.substring(lastIndex + 2)
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

### Typed IDs

For complex ID types beyond strings:

```ts
import { TypedHealer } from 'svelte-selfheal';

interface CompositeId {
	userId: string;
	orgId: string;
}

const healer = new TypedHealer<CompositeId>({
	idEncoder: (id) => `${id.userId}-${id.orgId}`,
	idDecoder: (encoded) => {
		const [userId, orgId] = encoded.split('-');
		return { userId, orgId };
	}
});

const url = healer.createUrl({ userId: '123', orgId: '456' }, 'Dashboard');
// → "dashboard.123-456"

const id = healer.parseId(url); // { userId: '123', orgId: '456' }
```

### URL Structure Options

Choose between `slug.id` and `id.slug` formats:

```ts
// Default: slug.id format
const healer = new Healer();
healer.createUrl('123', 'My Article'); // → "my-article.123"

// Reversed: id.slug format
const reversedHealer = new Healer({ order: 'reversed' });
reversedHealer.createUrl('123', 'My Article'); // → "123.my-article"
```

## Complete Example

```ts
// lib/healer.ts
import { Healer, sanitizers, separators } from 'svelte-selfheal';

export const healer = new Healer({
	sanitizer: sanitizers.simple,
	separator: separators.dot,
	replacements: {
		customReplacements: { '@': ' at ' }
	}
});

// routes/blog/[slug]/+page.server.ts
import { healer } from '$lib/healer.js';
import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types.js';

export const load: PageServerLoad = async ({ params, url }) => {
	const id = healer.parseId(params.slug);

	const article = await db.articles.findById(id);
	if (!article) throw error(404, 'Article not found');

	const expectedUrl = healer.createUrl(article.id, article.title, url.searchParams);
	if (!healer.validate(expectedUrl, params.slug, url.searchParams)) {
		throw redirect(301, expectedUrl);
	}

	return { article };
};
```

## V1 vs V2 Migration

### V1 (Legacy)

```ts
import { selfheal } from 'svelte-selfheal';

export const healer = selfheal({
	sanitize: (slug) => slug.toLowerCase(),
	identifier: {
		join: (slug, id) => `${slug}-${id}`,
		separate: (combined) => {
			/* complex logic */
		}
	},
	isEqual: (expected, actual) => expected === actual
});
```

### V2 (Current)

```ts
import { Healer, sanitizers, separators } from 'svelte-selfheal';

export const healer = new Healer({
	sanitizer: sanitizers.unicode,
	separator: separators.dot,
	order: 'default'
});
```

### Key Improvements in V2

1. **Zero Configuration**: Works perfectly with `new Healer()` - no setup required
2. **Collision-Free Design**: Dot separator (`.`) doesn't conflict with UUIDs or common ID formats
3. **Built-in Libraries**: Organized, discoverable sanitizers and separators
4. **Type Safety**: Full TypeScript support with proper generics
5. **Simpler API**: Class-based design with clear, documented options
6. **Better Defaults**: Smart defaults that work for 90% of use cases
7. **Automatic URL Safety**: Library handles all encoding/decoding transparently
8. **Flexible Character Handling**: Powerful replacement system for fine-tuning

### Migration Steps

1. Replace `selfheal()` function with `new Healer()`
2. Replace `sanitize` option with `sanitizer` (choose from built-in library)
3. Replace `identifier` option with `separator` (choose from built-in library)
4. Remove `isEqual` option (validation is now automatic and exact)
5. Update method calls - the core methods remain the same: `createUrl()`, `parseId()`, `validate()`

## License

Licensed under the [MIT license](https://github.com/dominic-schmid/svelte-selfheal/blob/main/LICENSE.md).
