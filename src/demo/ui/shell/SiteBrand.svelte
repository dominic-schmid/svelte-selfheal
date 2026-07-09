<script lang="ts">
  import SelfhealLogo from '$demo/ui/brand/SelfhealLogo.svelte';

  type Variant = 'header' | 'footer';

  interface Props {
    href: string;
    variant?: Variant;
  }

  let { href, variant = 'header' }: Props = $props();

  const linkClass = $derived(
    variant === 'header'
      ? 'flex items-center gap-2.5 text-foreground transition-[color] duration-150 hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card'
      : 'site-footer-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card'
  );

  const labelClass = $derived(
    variant === 'header' ? 'font-mono text-sm' : 'font-mono text-sm text-foreground'
  );
</script>

<!-- href is pre-resolved by DemoShell via resolve('/') -->
<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
<a {href} class={linkClass}>
  <SelfhealLogo size={20} class="size-5 shrink-0" />
  <span class={labelClass}>svelte-selfheal</span>
</a>
