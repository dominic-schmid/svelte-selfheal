<script lang="ts">
  import DocsArticle from '$demo/ui/docs/DocsArticle.svelte';
  import TryLinksSection from '$demo/ui/try/TryLinksSection.svelte';
  import { tryLinksFor } from '$demo/examples.js';
  import type { PageData } from './$types.js';

  let { data }: { data: PageData } = $props();

  const tryLinks = tryLinksFor('simple').filter((link) => link.badge !== '404');
</script>

<svelte:head>
  <title>{data.article.title} — svelte-selfheal</title>
</svelte:head>

<DocsArticle back>
  <h1>{data.article.title}</h1>
  <p>
    Loaded via ID <code>{data.article.id}</code>. The slug in the URL is cosmetic — the healer
    already corrected it if it was wrong.
  </p>

  <TryLinksSection title="Break the URL again" links={tryLinks} />
</DocsArticle>
