<script lang="ts">
	import Table from '$lib/components/Table.svelte';
	import { articleHealer, userHealer } from '$lib/mock/healer.js';

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

<style>
	section {
		margin-bottom: 2rem;
	}
</style>
