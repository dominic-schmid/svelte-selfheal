<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    href: string;
    label: string;
    ariaLabel?: string;
    class?: string;
    children?: Snippet;
  }

  let { href, label, ariaLabel, class: className, children }: Props = $props();

  const resolvedAriaLabel = $derived(ariaLabel ?? `${label} (opens in new tab)`);
</script>

<!-- eslint-disable svelte/no-navigation-without-resolve -- External URLs from siteLinks -->
<a
  {href}
  class={className}
  target="_blank"
  rel="noopener noreferrer"
  aria-label={resolvedAriaLabel}
>
  {#if children}
    {@render children()}
  {:else}
    {label}
  {/if}
</a>
<!-- eslint-enable svelte/no-navigation-without-resolve -->
