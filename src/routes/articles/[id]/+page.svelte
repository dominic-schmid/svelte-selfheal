<script lang="ts">
	import { articleHealer } from '$lib/mock/healer.js';

	let { data } = $props();
</script>

<a href="/">Home</a>

<h1>{data.slug}</h1>

<pre>{JSON.stringify(data.article, null, 4)}</pre>

<p>
	You can change or remove the URL before the ID (<i>{data.article.id}</i>) and the page should
	still load.
</p>

<div>
	<strong>Go deeper</strong>
	<ul>
		<li>
			<a href="{data.slug}/details/{articleHealer.createUrl(data.article.id, data.article.title)}">
				With canonical URL
			</a>
		</li>
		<li>
			<a href="{data.slug}/details/{data.article.id}">With ID only</a>
		</li>
	</ul>
</div>
