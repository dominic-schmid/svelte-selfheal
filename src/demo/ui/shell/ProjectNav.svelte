<script lang="ts">
  import GitHubIcon from '$demo/ui/brand/GitHubIcon.svelte';
  import NpmIcon from '$demo/ui/brand/NpmIcon.svelte';
  import ExternalLink from '$demo/ui/links/ExternalLink.svelte';
  import { siteLinks } from '$demo/site.js';

  type Variant = 'header' | 'footer';

  interface Props {
    variant?: Variant;
  }

  let { variant = 'header' }: Props = $props();
</script>

{#if variant === 'header'}
  <nav class="header-actions" aria-label="Project links">
    <ExternalLink
      href={siteLinks.npm.href}
      label={siteLinks.npm.label}
      ariaLabel="{siteLinks.npm.label} package page (opens in new tab)"
      class="icon-link"
    >
      <NpmIcon />
    </ExternalLink>
    <ExternalLink
      href={siteLinks.github.href}
      label={siteLinks.github.label}
      ariaLabel="{siteLinks.github.label} repository (opens in new tab)"
      class="icon-link"
    >
      <GitHubIcon />
    </ExternalLink>
    <ExternalLink
      href={siteLinks.docs.href}
      label={siteLinks.docs.shortLabel}
      ariaLabel="{siteLinks.docs.label} (opens in new tab)"
      class="header-text-link"
    />
  </nav>
{:else}
  <nav class="site-footer-nav" aria-label="Project links">
    <ExternalLink
      href={siteLinks.npm.href}
      label={siteLinks.npm.label}
      ariaLabel="{siteLinks.npm.label} package page (opens in new tab)"
      class="site-footer-link"
    />
    <ExternalLink
      href={siteLinks.github.href}
      label={siteLinks.github.label}
      ariaLabel="{siteLinks.github.label} repository (opens in new tab)"
      class="site-footer-link"
    />
    <ExternalLink
      href={siteLinks.docs.href}
      label={siteLinks.docs.shortLabel}
      ariaLabel="{siteLinks.docs.label} (opens in new tab)"
      class="site-footer-link"
    />
  </nav>
{/if}
