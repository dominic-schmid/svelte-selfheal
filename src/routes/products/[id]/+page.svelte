<script lang="ts">
	import { lengthPrefixedHealer } from '$lib/mock/healer.js';

	let { data } = $props();
</script>

<a href="/">Home</a>

<h1>{data.slug}</h1>

<div style="background: #f0f9ff; padding: 1rem; margin: 1rem 0; border-left: 4px solid #0ea5e9;">
	<strong>✨ Length-Prefixed URL Demo</strong><br />
	This UUID contains hyphens that would break normal hyphen separators, but works perfectly here!
	<br />
	<code>UUID: {data.product.id}</code>
</div>

<pre>{JSON.stringify(data.product, null, 4)}</pre>

<p>
	You can change or remove the URL before the ID (<i>{data.product.id}</i>) and the page should
	still load. The length prefix ensures perfect parsing even with UUIDs containing hyphens!
</p>

<div>
	<strong>Try these examples:</strong>
	<ul>
		<li>
			<a href={lengthPrefixedHealer.createUrl(data.product.id, data.product.title)}>
				Canonical URL
			</a>
		</li>
		<li>
			<a href={lengthPrefixedHealer.createUrl(data.product.id, 'wrong-title-but-still-works')}>
				Wrong title, but still works
			</a>
		</li>
		<li>
			<a href={data.product.id}>ID only</a>
		</li>
	</ul>
</div>
