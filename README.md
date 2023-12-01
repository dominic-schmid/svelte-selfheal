# svelte-selfheal

A simple Svelte package inspired by [this video from Aaron Francis](https://www.youtube.com/watch?v=a6lnfyES-LA) and heavily based on [a similar package for Laravel](https://github.com/lukeraymonddowning/self-healing-urls).

It allows you to redirect users to a canonical and SEO-friendly URL for a page, even if the slug is altered at any point or doesn't exist at all.

![svelte-selfheal-gif](./static/svelte-selfheal.gif)

### Example

Canonical URL: `https://my-app.com/blog/my-fancy-title-5312`

The following URLs would still redirect to the correct page

- `/blog/my-fancy-title-5312` _(original)_
- `/blog/my-fancy-but-spelled-wrong-title-5312`
- `/blog/5312`
- `/blog/-5312`
- `/blog/THIS should NOT be r3alURL   -5312`

## Installation

Install this package using any of the popular package managers.

```
npm i svelte-selfheal
```

```
pnpm add svelte-selfheal
```

```
yarn add svelte-selfheal
```

## Usage

Once installed, export a healer:

```ts
import { selfheal } from 'svelte-selfheal';

export const healer = selfheal();
```

Now you can use the self-healing functions anywhere across your app.

### Example +page.server.ts

Inside your load function you want to

1. Separate the identifier from the slug using the handler you defined on creation

```ts
const identifier = healer.parseId(params.id);
```

2. Query the database using the ID and see if something is found

```ts
const article = db.articles.find((article) => String(article.id) === identifier);
if (!article) throw error(404, `Article "${identifier}" not found`);
```

1. Create the slug using the DB values and compare it to the actual URL, then redirect if needed

```ts
const expectedUrl = healer.createUrl(article.id, article.title, url.searchParams);
const valid = healer.validate(expectedUrl, params.id, url.searchParams);
if (!valid) throw redirect(301, expectedUrl);
```

Now you are guaranteed to either be on the `404` page because no entity with that ID is found or you have been redirected to the correct, canonical slug for this entity.

### Complete example

```ts
import { db } from '$lib/db.js';
import { healer } from '$lib/selfheal.js';
import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types.js';

export const load: PageServerLoad = async ({ params, url }) => {
	const identifier = healer.parseId(params.id);

	const article = db.articles.find((article) => String(article.id) === identifier);
	if (!article) throw error(404, `Article "${identifier}" not found`);

	const expectedUrl = healer.createUrl(article.id, article.title, url.searchParams);
	const valid = healer.validate(expectedUrl, params.id, url.searchParams);
	if (!valid) throw redirect(301, expectedUrl);

	return { article, slug: params.id };
};
```

Don't worry if your "slug" isn't URL friendly; the package will take care of
formatting it for you whenever you call `createUrl()`. In fact, it doesn't even have to be unique because the
defined unique identifier for your model will also be included at the end.
If some entities have no article, you can just provide an empty string and the IDs will work as if there were no self-healing going on.

## Limitations

By default, the package requires that your unique identifier (such as the `id` or `uuid` column)
not have any `-` characters. However, you can implement your own `IdentifierHandler` as detailed in the next section and override how IDs are joined and separated.

## Configuration

During initialization you can configure the `healer` by passing in functions to handle its operations, or use its sensible defaults.

By default, the package uses

| Function                      | Method | Description                                                                                                                                 |
| ----------------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------- |
| sanitize()                    | Kebab  | Trims, replaces spaces with hyphens, removes multiple hyphens, removes hyphens at the start and end of the string and converts to lowercase |
| isEqual() | Name   | Compares the canonical and current routes by their names using a simple `===`                                                               |
| identifier()                  | Hyphen | Appends the ID to the slug using a hyphen `-`                                                                                               |

You can however change any of these individually, within the limitations mentioned above.

```ts
export const healer = selfheal({
	sanitize: (slug) => {
		/* ... */
	},
	isEqual: (expectedValue, actualValue) => {
		/* ... */
	},
	identifier: {
		join(slug, identifier) {
			/* ... */
		},
		separate(slug) {
			/* ... */
		}
	},
	
});
```

### Using a custom `IdentifierHandler`

If you need to customize how a slug is joined to a model identifier (which by default is just a hyphen),
you can create your own `IdentifierHandler` that returns a `join()` and a `separate()` function and supply itduring the initialization of your `healer`.

Here is an example using a `_` instead

```ts
export const healer = selfheal({
	identifier: {
		join(slug, identifier) {
			return `${slug}_${identifier}`;
		},
		separate(slug) {
			const [identifier, ...rest] = slug.split('_').reverse();
			return {
				identifier,
				slug: rest.reverse().join('_')
			};
		}
	}
});
```

This would result in URLs like `/my-fancy-title_123`, depending of course on how your sanitizer works.

## License

Licensed under the [MIT license](https://github.com/dominic-schmid/svelte-selfheal/blob/main/LICENSE.md).
