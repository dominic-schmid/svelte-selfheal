<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    id?: string | undefined;
    title: string;
    children: Snippet;
  }

  let { id, title, children }: Props = $props();
</script>

<section class="docs-section" {id}>
  <h2>{title}</h2>
  {@render children()}
</section>
