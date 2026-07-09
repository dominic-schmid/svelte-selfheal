<script lang="ts">
  import { resolve } from '$app/paths';
  import ExternalLink from '$demo/ui/links/ExternalLink.svelte';
  import ProjectNav from '$demo/ui/shell/ProjectNav.svelte';
  import SiteBrand from '$demo/ui/shell/SiteBrand.svelte';
  import { siteLinks } from '$demo/site.js';
  import type { Snippet } from 'svelte';

  interface Props {
    children: Snippet;
  }

  let { children }: Props = $props();

  const home = resolve('/');
</script>

<div class="flex min-h-svh flex-col bg-background">
  <a
    href="#main"
    class="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-3 focus:py-2 focus:text-primary-foreground"
  >
    Skip to content
  </a>

  <header class="border-b border-border bg-card">
    <div class="shell flex h-14 items-center justify-between">
      <SiteBrand href={home} variant="header" />
      <ProjectNav variant="header" />
    </div>
  </header>

  <main id="main" class="flex-1">
    <div class="shell py-8 sm:py-10">
      {@render children()}
    </div>
  </main>

  <footer class="site-footer">
    <div class="shell site-footer-inner">
      <SiteBrand href={home} variant="footer" />

      <div class="site-footer-end">
        <ProjectNav variant="footer" />
        <p class="site-footer-credit">
          MIT ·
          <ExternalLink
            href={siteLinks.x.href}
            label={siteLinks.x.handle}
            ariaLabel="{siteLinks.x.displayName} on X, {siteLinks.x.handle} (opens in new tab)"
            class="site-footer-author"
          />
        </p>
      </div>
    </div>
  </footer>
</div>
