<script lang="ts">
  import { resolve } from '$app/paths';
  import TryBadge from '$demo/ui/try/TryBadge.svelte';
  import type { TryLink as TryLinkData } from '$demo/examples.js';

  interface Props {
    link: TryLinkData;
  }

  let { link }: Props = $props();
</script>

<a href={resolve(link.href as `/${string}` & {})} class="try-link" class:try-link--ok={link.ok}>
  <span class="try-link-path">{link.label}</span>
  <TryBadge kind={link.badge} />
</a>
