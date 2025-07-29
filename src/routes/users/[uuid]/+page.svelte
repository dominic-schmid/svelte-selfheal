<script lang="ts">
	let { data } = $props();
</script>

<a href="/">Home</a>

<h1>{data.user.username}</h1>

<pre>{JSON.stringify(data.user, null, 4)}</pre>

<p>
	You can change or remove the URL after the ID (<i>{data.user.id}</i>) and the page should still
	load.
</p>
