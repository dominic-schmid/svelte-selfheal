<script lang="ts">
	import { userHealer } from '$demo/mock/healer.js';

	let { data } = $props();
</script>

<a href="/">Home</a>

<h1>{data.slug}</h1>

<pre>{JSON.stringify(data.user, null, 4)}</pre>

<p>
	You can change or remove the URL after the ID (<i>{data.user.id}</i>) and the page should still
	load.
</p>

<div>
	<strong>Try these examples:</strong>
	<ul>
		<li>
			<a href={userHealer.createUrl(data.user.id, data.user.username)}> Canonical URL </a>
		</li>
		<li>
			<a href={userHealer.createUrl(data.user.id, 'wrong-title-but-still-works')}>
				Wrong title, but still works
			</a>
		</li>
		<li>
			<a href={data.user.id}>ID only</a>
		</li>
	</ul>
</div>
