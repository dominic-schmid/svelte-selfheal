<script lang="ts">
	import type { Healer } from '$lib/index.js';

	interface TableItem {
		id: string | number;
		title: string;
	}

	interface Props {
		data: TableItem[];
		healer: Healer;
		namespace: string;
	}

	let { data, healer, namespace }: Props = $props();
</script>

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
		{#each data as { id, title }}
			<tr>
				<td>{id}</td>
				<td>{title}</td>
				<td>
					<a href="/{namespace}/{healer.createUrl(id, title)}">
						/{healer.createUrl(id, title)}
					</a>
				</td>
				<td>
					<a href="/{namespace}/{id}">/{id}</a>
				</td>
			</tr>
		{/each}
	</tbody>
</table>
