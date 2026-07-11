<script lang="ts">
  import DocsSection from '$demo/ui/docs/DocsSection.svelte';
  import ExternalLink from '$demo/ui/links/ExternalLink.svelte';
  import YouTubeEmbed from '$demo/ui/media/YouTubeEmbed.svelte';
  import { lander } from '$demo/copy.js';
  import { siteLinks } from '$demo/site.js';
</script>

<DocsSection id="inspiration" title={lander.inspirationTitle}>
  <p class="text-pretty">
    <ExternalLink
      href={siteLinks.aaronFrancis.href}
      label={siteLinks.aaronFrancis.name}
      ariaLabel="{siteLinks.aaronFrancis.name} on X (opens in new tab)"
    />
    {lander.inspirationLead}
  </p>
  <YouTubeEmbed
    videoId={siteLinks.aaronFrancis.videoId}
    title={siteLinks.aaronFrancis.videoTitle}
  />
  <p class="inspiration-note">{lander.inspirationShout}</p>
</DocsSection>
