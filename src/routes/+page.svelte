<script lang="ts">
	import Table from '$demo/components/Table.svelte';
	import { articleHealer, userHealer } from '$demo/mock/healer.js';

	let { data } = $props();
</script>

<a href="/playground" class="playground-link">Open Playground</a>

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

	.playground-link {
		width: fit-content;
		display: inline-flex;
		padding: 0.5rem 1rem;
		background-color: #007bff;
		color: white;
		text-decoration: none;
		border-radius: 0.5rem;
	}
</style>
