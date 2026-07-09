<script lang="ts">
  import '../app.css';
  import DemoShell from '$demo/ui/shell/DemoShell.svelte';

  let { children } = $props();
</script>

<DemoShell>
  {@render children()}
</DemoShell>
