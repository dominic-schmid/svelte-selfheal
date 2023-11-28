<script lang="ts">
	import { page } from '$app/stores';
</script>

<main>
	<h1>Error {$page.status}</h1>
	<p>{$page.error?.message}</p>
</main>
