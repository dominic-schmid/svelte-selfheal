<script lang="ts">
  import DocsArticle from '$demo/ui/docs/DocsArticle.svelte';
  import TryLinksSection from '$demo/ui/try/TryLinksSection.svelte';
  import { canonicalDisplay, tryLinksFor } from '$demo/examples.js';
  import type { PageData } from './$types.js';

  let { data }: { data: PageData } = $props();

  const tryLinks = $derived(tryLinksFor('nested'));
</script>

<svelte:head>
  <title>{data.author.name} — nested — svelte-selfheal</title>
</svelte:head>

<DocsArticle back>
  <h1>{data.author.name}</h1>
  <p>
    Author page via <code>stack()</code> — article <code>{data.article.title}</code> (ID
    <code>{data.article.id}</code>), author ID <code>{data.author.id}</code>. Both slugs are
    cosmetic.
  </p>
  <p class="text-sm text-muted-foreground">
    Canonical path: <code>{canonicalDisplay('nested')}</code>
  </p>

  <TryLinksSection title="Break the URL again" links={tryLinks} />
</DocsArticle>
