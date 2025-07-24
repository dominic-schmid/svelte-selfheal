<script lang="ts">
	import { page } from '$app/state';
</script>

<main>
	<h1>Error {page.status}</h1>
	<p>{page.error?.message}</p>
</main>
