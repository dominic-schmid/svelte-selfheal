<script lang="ts">
  import DocsArticle from '$demo/ui/docs/DocsArticle.svelte';
  import TryLinksSection from '$demo/ui/try/TryLinksSection.svelte';
  import { tryLinksFor } from '$demo/examples.js';

  const missingLink = tryLinksFor('simple').find((link) => link.badge === '404');
  const tryLinks = missingLink ? [missingLink] : [];
</script>

<svelte:head>
  <title>Not found — svelte-selfheal</title>
</svelte:head>

<DocsArticle back>
  <h1>Page not found</h1>
  <p>No resource matched the ID in that URL.</p>
  <p class="text-sm text-muted-foreground">
    <code>healer.run()</code> returned <code>notFound</code> — your load called
    <code>error(404)</code>.
  </p>

  {#if tryLinks.length > 0}
    <TryLinksSection title="Try a missing ID" links={tryLinks} />
  {/if}
</DocsArticle>
