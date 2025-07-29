<script lang="ts">
	import Table from '$demo/components/Table.svelte';
	import ConfigGroup from '$demo/components/ConfigGroup.svelte';
	import SliderGroup from '$demo/components/SliderGroup.svelte';
	import { playgroundStore } from '$demo/stores/playground.js';

	// Sample titles for generation
	const sampleTitles = [
		'Getting Started Guide',
		'Advanced Configuration',
		'Best Practices & Tips',
		'Common Issues & Solutions',
		'API Reference Documentation',
		'Performance Optimization',
		'Security Considerations',
		'Deployment Strategies',
		'Testing & Quality Assurance',
		'Community Guidelines',
		'Troubleshooting Guide',
		'Integration Examples',
		'Migration Tutorial',
		'Feature Announcements',
		'Technical Deep Dive'
	];

	// ID generators
	function generateUUID(): string {
		return crypto.randomUUID();
	}

	function generateRandomInt(): number {
		return Math.floor(Math.random() * 999999) + 1;
	}

	function generateRandomString(length: number): string {
		const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
		return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
	}

	function generateId(): string | number {
		switch ($playgroundStore.config.idType) {
			case 'uuid':
				return generateUUID();
			case 'random-int':
				return generateRandomInt();
			case 'random-string':
				return generateRandomString($playgroundStore.config.stringLength);
			default:
				return generateUUID();
		}
	}

	function generateItems() {
		const items = Array.from({ length: $playgroundStore.config.itemCount }, (_, i) => ({
			id: generateId(),
			title:
				sampleTitles[i % sampleTitles.length] +
				(Math.floor(i / sampleTitles.length) > 0
					? ` #${Math.floor(i / sampleTitles.length) + 1}`
					: '')
		}));
		playgroundStore.setItems(items);
	}

	// Generate initial items
	generateItems();

	// Auto-regenerate when id type or count changes
	$: if (
		$playgroundStore.config.idType ||
		$playgroundStore.config.itemCount ||
		$playgroundStore.config.stringLength
	) {
		generateItems();
	}
</script>

<div class="playground-container">
	<header class="playground-header">
		<div class="playground-header-left">
			<h1>Healer Playground</h1>
			<a href="/" class="back-link">← Home</a>
		</div>
		<div class="config-display">
			<span class="config-label">Current Configuration:</span>
			<code>{$playgroundStore.configString}</code>
		</div>
	</header>

	<div class="playground-layout">
		<aside class="controls-sidebar">
			<ConfigGroup
				title="Separator"
				name="separator"
				value={$playgroundStore.config.separatorType}
				onchange={(val) => playgroundStore.updateConfig({ separatorType: val as any })}
				options={[
					{ value: 'underscore', label: 'Underscore (_)' },
					{ value: 'dot', label: 'Dot (.)' },
					{ value: 'tilde', label: 'Tilde (~)' },
					{ value: 'custom', label: 'Custom' }
				]}
			>
				{#if $playgroundStore.config.separatorType === 'custom'}
					<input
						type="text"
						value={$playgroundStore.config.customSeparator}
						on:input={(e) =>
							playgroundStore.updateConfig({
								customSeparator: (e.target as HTMLInputElement).value
							})}
						placeholder="Custom separator"
						class="custom-input"
					/>
				{/if}
			</ConfigGroup>

			<ConfigGroup
				title="ID Type"
				name="idType"
				value={$playgroundStore.config.idType}
				onchange={(val) => playgroundStore.updateConfig({ idType: val as any })}
				options={[
					{ value: 'uuid', label: 'UUID' },
					{ value: 'random-int', label: 'Random Int' },
					{ value: 'random-string', label: 'Random String' }
				]}
			>
				{#if $playgroundStore.config.idType === 'random-string'}
					<SliderGroup
						title="String Length"
						value={$playgroundStore.config.stringLength}
						min={3}
						max={20}
						onchange={(val) => playgroundStore.updateConfig({ stringLength: val })}
					/>
				{/if}
			</ConfigGroup>

			<ConfigGroup
				title="URL Order"
				name="order"
				value={$playgroundStore.config.order}
				onchange={(val) => playgroundStore.updateConfig({ order: val as any })}
				options={[
					{ value: 'id-first', label: 'ID First' },
					{ value: 'id-last', label: 'ID Last' }
				]}
			/>

			<ConfigGroup
				title="Sanitizer"
				name="sanitizer"
				value={$playgroundStore.config.sanitizerType}
				onchange={(val) => playgroundStore.updateConfig({ sanitizerType: val as any })}
				options={[
					{ value: 'unicode', label: 'Unicode' },
					{ value: 'simple', label: 'Simple' },
					{ value: 'preserve', label: 'Preserve' }
				]}
			/>

			<SliderGroup
				title="Item Count"
				value={$playgroundStore.config.itemCount}
				min={1}
				max={15}
				onchange={(val) => playgroundStore.updateConfig({ itemCount: val })}
			>
				<button on:click={generateItems} class="regenerate-btn">Regenerate</button>
			</SliderGroup>
		</aside>

		<main class="table-section">
			<h2 class="table-header">Generated Items</h2>

			<Table
				data={$playgroundStore.items}
				healer={$playgroundStore.healer}
				namespace="playground"
			/>
		</main>
	</div>
</div>

<style>
	.playground-container {
		position: absolute;
		inset: 0;
		height: 100vh;
		width: 100vw;
		display: flex;
		flex-direction: column;
		margin: 0;
		padding: 0;
	}

	.playground-header {
		background: #f8f9fa;
		border-bottom: 1px solid #e9ecef;
		padding: 1rem;
		flex-shrink: 0;
		display: flex;
		align-items: center;
		gap: 1rem;
		flex-wrap: wrap;
	}

	.playground-header-left {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		width: 100%;
		max-width: 280px;
	}

	h1 {
		color: #333;
		margin: 0;
		font-size: 1.5rem;
		flex-shrink: 0;
	}

	h2 {
		color: #444;
		margin: 0 0 1rem 0;
		font-size: 1.2rem;
	}

	.playground-layout {
		display: flex;
		flex: 1;
		overflow: hidden;
		margin: 0 auto;
		width: 100%;
	}

	.controls-sidebar {
		width: 100%;
		max-width: 280px;
		flex-shrink: 0;
		background: #f8f9fa;
		border-right: 1px solid #e9ecef;
		padding: 1rem;
		overflow-y: auto;
		position: sticky;
		top: 0;
		height: calc(100vh - 70px);
	}

	.table-section {
		flex: 1;
		overflow-y: auto;
		padding: 1rem;
	}

	.table-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1rem;
	}

	.custom-input {
		margin-top: 0.5rem;
		padding: 0.4rem;
		border: 1px solid #ccc;
		border-radius: 3px;
		font-family: monospace;
		font-size: 0.8rem;
		width: calc(100% - 10px);
		box-sizing: border-box;
	}

	.regenerate-btn {
		margin-top: 1rem;
		padding: 0.4rem 0.8rem;
		background-color: #28a745;
		color: white;
		border: none;
		border-radius: 3px;
		cursor: pointer;
		font-size: 0.8rem;
		width: 100%;
	}

	.regenerate-btn:hover {
		background-color: #218838;
	}

	.config-display {
		background: #2d3748;
		color: #e2e8f0;
		padding: 0.75rem 1rem;
		border-radius: 6px;
		flex: 1;
		min-width: 300px;
	}

	.config-label {
		font-size: 0.9rem;
		font-weight: 600;
		opacity: 0.9;
		display: block;
		margin-bottom: 0.5rem;
	}

	.config-display code {
		font-family: 'Courier New', Courier, monospace;
		font-size: 0.85rem;
		line-height: 1.4;
		word-break: break-word;
		display: block;
	}

	.back-link {
		color: #007bff;
		text-decoration: none;
		font-weight: 500;
		font-size: 0.9rem;
	}

	.back-link:hover {
		text-decoration: underline;
	}

	/* Responsive design */
	@media (max-width: 768px) {
		.playground-layout {
			flex-direction: column;
		}

		.controls-sidebar {
			width: 100%;
			max-height: 40vh;
		}

		.playground-container {
			height: auto;
			padding: 1rem;
		}
	}
</style>
