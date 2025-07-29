<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		title: string;
		options: Array<{ value: string; label: string; disabled?: boolean }>;
		value: string;
		onchange: (value: string) => void;
		name: string;
		children?: Snippet;
	}

	let { title, options, value, onchange, name, children }: Props = $props();

	function handleChange(event: Event) {
		const target = event.target as HTMLInputElement;
		onchange(target.value);
	}
</script>

<div class="config-group">
	<h4>{title}</h4>
	<div class="radio-group">
		{#each options as option}
			<label class:disabled={option.disabled}>
				<input
					type="radio"
					{name}
					value={option.value}
					checked={value === option.value}
					disabled={option.disabled}
					onchange={handleChange}
				/>
				{option.label}
			</label>
		{/each}
	</div>

	{#if children}
		<div class="config-group-content">
			{@render children?.()}
		</div>
	{/if}
</div>

<style>
	.config-group {
		background: white;
		padding: 0.75rem;
		border-radius: 4px;
		border: 1px solid #dee2e6;
		margin-bottom: 0.75rem;
	}

	.config-group-content {
		margin-top: 0.5rem;
	}

	h4 {
		color: #495057;
		margin: 0 0 0.5rem 0;
		font-size: 0.9rem;
		font-weight: 600;
	}

	.radio-group {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	label {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		cursor: pointer;
		padding: 0.1rem;
		font-size: 0.85rem;
		color: #6c757d;
	}

	label.disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	input[type='radio'] {
		margin: 0;
		transform: scale(0.9);
	}

	input[type='radio']:disabled {
		cursor: not-allowed;
	}
</style>
