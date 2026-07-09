<script lang="ts">
  import InstallCommand from '$demo/ui/lander/InstallCommand.svelte';

  interface Props {
    version: string;
    title?: string;
    lead: string;
  }

  let { version, title = 'svelte-selfheal', lead }: Props = $props();
</script>

<header class="docs-hero">
  <div class="hero-mark" aria-hidden="true">
    <svg
      class="hero-mark-svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke-width="1.75"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <circle class="hero-mark-link" cx="9" cy="12" r="3.6" />
      <path class="hero-mark-loop" d="M16.578 8.764A3.6 3.6 0 1 1 13.422 8.764" />
      <path class="hero-mark-head" d="M15.759 7.625 14.167 10.292 12.677 7.236Z" />
    </svg>
  </div>

  <p class="docs-kicker">
    <span class="docs-version">v{version}</span>
  </p>
  <h1 class="text-balance">{title}</h1>
  <p class="lead text-pretty">{lead}</p>
  <InstallCommand />
</header>
