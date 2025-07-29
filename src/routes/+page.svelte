<script lang="ts">
	import Table from '$lib/components/Table.svelte';
	import { articleHealer, userHealer, lengthPrefixedHealer } from '$lib/mock/healer.js';

	let { data } = $props();
</script>

<section>
	<h1>Articles</h1>
	<Table
		data={data.articles.map((article) => ({ id: article.id, title: article.title }))}
		healer={articleHealer}
		namespace="articles"
	/>
</section>

<section>
	<h1>Users</h1>
	<Table
		data={data.users.map((user) => ({ id: user.id, title: user.username }))}
		healer={userHealer}
		namespace="users"
	/>
</section>

<section>
	<h1>Products (Length-Prefixed URLs)</h1>
	<p style="color: #666; font-size: 0.9em; margin-bottom: 1rem;">
		These UUIDs contain hyphens that would break normal hyphen separators, but work perfectly with
		length-prefixed URLs.
	</p>
	<Table
		data={data.products.map((product) => ({ id: product.id, title: product.title }))}
		healer={lengthPrefixedHealer}
		namespace="products"
	/>
</section>

<style>
	section {
		margin-bottom: 2rem;
	}
</style>
