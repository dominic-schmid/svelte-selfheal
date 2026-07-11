<script lang="ts">
  import { tryBadgeLabel, type TryBadge as TryBadgeKind } from '$demo/examples.js';

  interface Props {
    kind: TryBadgeKind;
  }

  let { kind }: Props = $props();
</script>

<span class="try-badge try-badge--{kind}">
  {tryBadgeLabel[kind]}
</span>
