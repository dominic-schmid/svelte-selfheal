<script lang="ts">
  interface Props {
    html: string;
    filename?: string;
  }

  let { html, filename }: Props = $props();
</script>

<figure class="code-figure">
  {#if filename}
    <figcaption class="code-filename" title={filename}>{filename}</figcaption>
  {/if}
  <div class="code-block">
    <div class="highlighted-segment">
      <!-- eslint-disable-next-line svelte/no-at-html-tags -->
      {@html html}
    </div>
  </div>
</figure>

<style>
  .highlighted-segment :global(pre.shiki) {
    margin: 0;
    padding: 0;
    background: transparent !important;
  }

  .highlighted-segment :global(.shiki) {
    background: transparent !important;
    font-family: var(--font-mono);
  }

  .highlighted-segment :global(.shiki code) {
    display: block;
    padding: 0;
    font-family: inherit;
  }

  .highlighted-segment :global(.shiki .line) {
    display: block;
    min-height: 1.45em;
  }

  .highlighted-segment :global(.shiki .line:empty) {
    min-height: 1.45em;
  }
</style>
