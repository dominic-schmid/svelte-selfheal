<script lang="ts">
  import DocsSection from '$demo/ui/docs/DocsSection.svelte';
  import TryLink from '$demo/ui/try/TryLink.svelte';
  import type { Snippet } from 'svelte';
  import type { TryLink as TryLinkData } from '$demo/examples.js';

  interface Props {
    title: string;
    links: TryLinkData[];
    id?: string | undefined;
    children?: Snippet;
  }

  let { title, links, id, children }: Props = $props();
</script>

<DocsSection {id} {title}>
  {#if children}
    {@render children()}
  {/if}
  <ul class="try-list">
    {#each links as link (link.href)}
      <li>
        <TryLink {link} />
      </li>
    {/each}
  </ul>
</DocsSection>
