<script lang="ts">
  import { resolve } from '$app/paths';
  import type { PageData } from './$types.js';

  let { data }: { data: PageData } = $props();
</script>

<a href={resolve('/')}>Home</a>

<h1>{data.slug}</h1>

<pre>{JSON.stringify(data.article, null, 4)}</pre>

<p>
  You can change or remove the URL before the ID (<i>{data.article.id}</i>) and the page should
  still load.
</p>

<a href={resolve(`/${data.slug}/details/${String(data.article.id)}`)}>Go deeper</a>
