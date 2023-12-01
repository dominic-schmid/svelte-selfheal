<script lang="ts">
	export let data;
</script>

<a href="/">Home</a>

<h1>Inner details of {data.slug}</h1>

<pre>{JSON.stringify(data.article, null, 4)}</pre>

<p>
	You can change or remove the URL before the ID (<i>{data.article.id}</i>) and the page should
	still load.
</p>
<p>
	Note, however, that changing the parent slug will not heal that part of the URL as there is
	currently no clean way (that I know) to "listen" to that and invalidate it without checking on
	every nested child request, which is likely wasted performance and sacrifices loading time for
	little gains.
</p>
