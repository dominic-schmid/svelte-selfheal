<script lang="ts">
  import BackLink from '$demo/ui/docs/BackLink.svelte';
  import type { Snippet } from 'svelte';

  interface Props {
    back?: boolean;
    children: Snippet;
  }

  let { back = false, children }: Props = $props();
</script>

<article class="docs">
  {#if back}
    <BackLink />
  {/if}
  {@render children()}
</article>
