<script lang="ts">
  import DocsArticle from '$demo/ui/docs/DocsArticle.svelte';
  import DocsSection from '$demo/ui/docs/DocsSection.svelte';
  import SetupCodeSwitcher from '$demo/ui/code/SetupCodeSwitcher.svelte';
  import SetupExamples from '$demo/ui/lander/SetupExamples.svelte';
  import DocsHero from '$demo/ui/lander/DocsHero.svelte';
  import HowItWorksIllustration from '$demo/ui/lander/HowItWorksIllustration.svelte';
  import InspirationSection from '$demo/ui/lander/InspirationSection.svelte';
  import StrategyGroups from '$demo/ui/lander/StrategyGroups.svelte';
  import TryBadge from '$demo/ui/try/TryBadge.svelte';
  import TryLinksSection from '$demo/ui/try/TryLinksSection.svelte';
  import { customizeExplainer, lander, landerSeo } from '$demo/copy.js';
  import { canonicalDisplay, tryLinksFor } from '$demo/examples.js';
  import type { LayoutData } from './$types.js';
  import type { PageData } from './$types.js';

  let { data }: { data: LayoutData & PageData } = $props();

  const tryLinks = tryLinksFor('simple');
  const canonicalUrl = $derived(data.siteOrigin ? `${data.siteOrigin}/` : undefined);
  const ogImageUrl = $derived(
    data.siteOrigin ? `${data.siteOrigin}/svelte-selfheal.gif` : undefined
  );
  const jsonLd = $derived(
    JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'svelte-selfheal',
      applicationCategory: 'DeveloperApplication',
      operatingSystem: 'Any',
      description: landerSeo.description,
      softwareVersion: data.version,
      url: canonicalUrl,
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' }
    })
  );
  const jsonLdScript = $derived('<script type="application/ld+json">' + jsonLd + '</scr' + 'ipt>');
</script>

<svelte:head>
  <title>{landerSeo.title}</title>
  <meta name="description" content={landerSeo.description} />
  {#if canonicalUrl}
    <link rel="canonical" href={canonicalUrl} />
  {/if}
  <meta property="og:title" content="svelte-selfheal" />
  <meta property="og:description" content={landerSeo.ogDescription} />
  <meta property="og:type" content="website" />
  {#if canonicalUrl}
    <meta property="og:url" content={canonicalUrl} />
  {/if}
  {#if ogImageUrl}
    <meta property="og:image" content={ogImageUrl} />
    <meta property="og:image:alt" content={landerSeo.ogImageAlt} />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:image" content={ogImageUrl} />
  {:else}
    <meta name="twitter:card" content="summary" />
  {/if}
  <meta name="twitter:title" content="svelte-selfheal" />
  <meta name="twitter:description" content={landerSeo.ogDescription} />
  <!-- eslint-disable-next-line svelte/no-at-html-tags -->
  {@html jsonLdScript}
</svelte:head>

<DocsArticle>
  <DocsHero version={data.version} lead={lander.hero} />

  <TryLinksSection id="try" title="Try it" links={tryLinks}>
    <p>
      Wrong slugs <TryBadge kind="301" /> to <code>{canonicalDisplay('simple')}</code>. Missing IDs
      <TryBadge kind="404" />. {lander.try}
    </p>
  </TryLinksSection>

  <DocsSection id="setup" title="Setup">
    <p class="text-pretty">{lander.setup}</p>
    <SetupCodeSwitcher
      healerSimpleHtml={data.healerSimpleHtml}
      healerNestedHtml={data.healerNestedHtml}
      runLoadHtml={data.runLoadHtml}
      stackLoadHtml={data.stackLoadHtml}
    />
    <SetupExamples />
  </DocsSection>

  <DocsSection id="how" title="How it works">
    <p class="text-pretty">{lander.how}</p>
    <HowItWorksIllustration />
  </DocsSection>

  <InspirationSection />

  <DocsSection id="customize" title={customizeExplainer.title}>
    <p class="text-pretty">{customizeExplainer.lead}</p>
    <StrategyGroups />
  </DocsSection>
</DocsArticle>
