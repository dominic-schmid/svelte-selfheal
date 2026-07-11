<script lang="ts">
  import GitHubLink from '$demo/ui/links/GitHubLink.svelte';
  import { siteLinks } from '$demo/site.js';
</script>

<p class="setup-examples-foot">
  <GitHubLink
    href={siteLinks.examples.tree}
    label="Browse examples →"
    ariaLabel="Browse examples in the repository (opens in new tab)"
  />
</p>
