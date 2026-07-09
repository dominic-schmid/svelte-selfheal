<script lang="ts">
  import GitHubIcon from '$demo/ui/brand/GitHubIcon.svelte';

  interface Props {
    href: string;
    label: string;
    ariaLabel?: string;
    class?: string;
    iconOnly?: boolean;
  }

  let { href, label, ariaLabel, class: className, iconOnly = false }: Props = $props();

  const resolvedAriaLabel = $derived(ariaLabel ?? `${label} on GitHub (opens in new tab)`);
</script>

<!-- eslint-disable svelte/no-navigation-without-resolve -- External GitHub URLs -->
<a
  {href}
  class={['github-link', className, iconOnly && 'github-link--icon-only']}
  target="_blank"
  rel="noopener noreferrer"
  aria-label={resolvedAriaLabel}
>
  {#if iconOnly}
    <GitHubIcon />
  {:else}
    <GitHubIcon class="github-link-icon" />
    <span class="github-link-label">{label}</span>
  {/if}
</a>
<!-- eslint-enable svelte/no-navigation-without-resolve -->
