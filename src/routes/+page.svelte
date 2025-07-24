<script lang="ts">
	import { myHealer } from '$lib/mock/healer.js';
	let { data } = $props();
</script>

<h1>Articles</h1>
<table class="pure-table pure-table-bordered">
	<thead>
		<tr>
			<th>ID</th>
			<th>Title</th>
			<th>SEO friendly URL</th>
			<th>ID URL</th>
		</tr>
	</thead>
	<tbody>
		{#each data.articles as { id, title }}
			<tr>
				<td>{id}</td>
				<td>{title}</td>
				<td>
					<a href="/{myHealer.createUrl(id, title)}">
						/{myHealer.createUrl(id, title)}
					</a>
				</td>
				<td>
					<a href="/{id}">/{id}</a>
				</td>
			</tr>
		{/each}
	</tbody>
</table>
