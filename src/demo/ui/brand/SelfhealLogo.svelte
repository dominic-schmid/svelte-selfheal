<script lang="ts">
  import type { SVGAttributes } from 'svelte/elements';

  interface Props extends SVGAttributes<SVGSVGElement> {
    size?: number | string;
  }

  let { size = 20, class: className, ...rest }: Props = $props();
</script>

<!--
  svelte-selfheal mark: a centered chain of two interlocking links. The right
  link is a 301 redirect that comes out on the right and circles back (accent).
-->
<svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 24 24"
  width={size}
  height={size}
  fill="none"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class={className}
  aria-hidden="true"
  {...rest}
>
  <circle cx="9" cy="12" r="3.6" stroke="currentColor" />
  <path stroke="#FF3E00" d="M16.578 8.764A3.6 3.6 0 1 1 13.422 8.764" />
  <path fill="#FF3E00" stroke="none" d="M15.759 7.625 14.167 10.292 12.677 7.236Z" />
</svg>
