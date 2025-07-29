<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		title: string;
		value: number;
		min: number;
		max: number;
		onchange: (value: number) => void;
		suffix?: string;
		children?: Snippet;
	}

	let { title, value, min, max, onchange, suffix = '', children }: Props = $props();

	function handleChange(event: Event) {
		const target = event.target as HTMLInputElement;
		onchange(parseInt(target.value));
	}
</script>

<div class="slider-group">
	<label class="slider-label">
		{title}: <strong>{value}{suffix}</strong>
		<input type="range" {min} {max} {value} oninput={handleChange} class="slider" />
	</label>

	{@render children?.()}
</div>

<style>
	.slider-group {
		background: white;
		padding: 0.75rem;
		border-radius: 4px;
		border: 1px solid #dee2e6;
	}

	.slider-label {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		font-size: 0.85rem;
		color: #495057;
		font-weight: 500;
	}

	.slider {
		width: 100%;
		height: 4px;
		border-radius: 2px;
		background: #e9ecef;
		outline: none;
		-webkit-appearance: none;
	}

	.slider::-webkit-slider-thumb {
		-webkit-appearance: none;
		appearance: none;
		width: 16px;
		height: 16px;
		border-radius: 50%;
		background: #007bff;
		cursor: pointer;
	}

	.slider::-moz-range-thumb {
		width: 16px;
		height: 16px;
		border-radius: 50%;
		background: #007bff;
		cursor: pointer;
		border: none;
	}
</style>
