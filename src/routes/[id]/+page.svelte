<script lang="ts">
	export let data;
</script>

<a href="/">Home</a>

<h1>{data.slug}</h1>

<pre>{JSON.stringify(data.article, null, 4)}</pre>

<p>
	You can change or remove the URL before the ID (<i>{data.article.id}</i>) and the page should
	still load.
</p>

<a href="{data.slug}/details/{data.article.id}">Go deeper</a>
