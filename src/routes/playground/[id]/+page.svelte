<script lang="ts">
	let { data } = $props();
</script>

<div class="item-page">
	<div class="navigation">
		<a href="/playground">← Back to Playground</a>
		<a href="/">← Home</a>
	</div>

	<h1>Playground Item: {data.item.title}</h1>

	<div class="item-details">
		<div class="detail-card">
			<h3>Item Information</h3>
			<dl>
				<dt>ID:</dt>
				<dd><code>{data.item.id}</code></dd>

				<dt>Title:</dt>
				<dd>{data.item.title}</dd>

				<dt>URL Slug:</dt>
				<dd><code>{data.slug}</code></dd>

				<dt>Healer Configuration:</dt>
				<dd><code>{data.healerConfig}</code></dd>
			</dl>
		</div>

		<div class="detail-card">
			<h3>URL Healing Demonstration</h3>
			<p>This page demonstrates how the URL healer works. Try these experiments:</p>

			<div class="experiments">
				<div class="experiment">
					<h4>Change the URL slug</h4>
					<p>
						Try changing the text before the ID in the URL and reload the page. The healer will
						automatically redirect to the canonical URL.
					</p>
					<code>Current: /playground/{data.slug}</code>
				</div>

				<div class="experiment">
					<h4>Use just the ID</h4>
					<p>
						Navigate directly to the ID-only URL and see how it redirects to the full SEO-friendly
						URL.
					</p>
					<a href="/playground/{data.item.id}">Try ID-only URL: /playground/{data.item.id}</a>
				</div>
			</div>
		</div>

		<div class="detail-card">
			<h3>Generated Content</h3>
			<p>
				This is a dynamically generated playground item to demonstrate the healer functionality. In
				a real application, this would be actual content fetched from a database or API.
			</p>

			<div class="mock-content">
				<h4>Sample Article Content</h4>
				<p>
					Lorem ipsum dolor sit amet, consectetur adipiscing elit. This playground item shows how
					SEO-friendly URLs work with the svelte-selfheal library. The ID <code>{data.item.id}</code
					> is extracted from the URL and used to fetch the appropriate content.
				</p>

				<p>Key features demonstrated:</p>
				<ul>
					<li>Automatic URL healing when slug doesn't match</li>
					<li>SEO-friendly URLs with readable text</li>
					<li>Robust ID extraction from various URL formats</li>
					<li>Configurable separators and sanitization</li>
				</ul>
			</div>
		</div>
	</div>
</div>

<style>
	.item-page {
		max-width: 800px;
		margin: 0 auto;
		padding: 2rem;
	}

	.navigation {
		display: flex;
		gap: 1rem;
		margin-bottom: 2rem;
		padding-bottom: 1rem;
		border-bottom: 1px solid #e9ecef;
	}

	.navigation a {
		color: #007bff;
		text-decoration: none;
		font-weight: 500;
	}

	.navigation a:hover {
		text-decoration: underline;
	}

	h1 {
		color: #333;
		margin-bottom: 2rem;
	}

	.item-details {
		display: grid;
		gap: 2rem;
	}

	.detail-card {
		background: #f8f9fa;
		padding: 1.5rem;
		border-radius: 8px;
		border: 1px solid #e9ecef;
	}

	.detail-card h3 {
		color: #495057;
		margin-bottom: 1rem;
	}

	.detail-card h4 {
		color: #6c757d;
		margin-bottom: 0.5rem;
	}

	dl {
		display: grid;
		grid-template-columns: auto 1fr;
		gap: 0.5rem 1rem;
		margin: 0;
	}

	dt {
		font-weight: 600;
		color: #495057;
	}

	dd {
		margin: 0;
		color: #6c757d;
	}

	code {
		background: #e9ecef;
		padding: 0.2rem 0.4rem;
		border-radius: 3px;
		font-family: 'Courier New', Courier, monospace;
		font-size: 0.9rem;
	}

	.experiments {
		display: grid;
		gap: 1rem;
		margin-top: 1rem;
	}

	.experiment {
		background: white;
		padding: 1rem;
		border-radius: 6px;
		border: 1px solid #dee2e6;
	}

	.experiment a {
		color: #007bff;
		text-decoration: none;
	}

	.experiment a:hover {
		text-decoration: underline;
	}

	.mock-content {
		background: white;
		padding: 1rem;
		border-radius: 6px;
		border: 1px solid #dee2e6;
		margin-top: 1rem;
	}

	.mock-content ul {
		margin: 1rem 0;
		padding-left: 2rem;
	}

	.mock-content li {
		margin-bottom: 0.5rem;
		color: #6c757d;
	}
</style>
