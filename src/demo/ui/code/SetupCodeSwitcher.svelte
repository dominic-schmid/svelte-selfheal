<script lang="ts">
  import HighlightedCode from '$demo/ui/code/HighlightedCode.svelte';
  import { setupFilenames } from '$demo/copy.js';
  import { exampleTabs } from '$demo/examples.js';

  interface Props {
    healerSimpleHtml: string;
    healerNestedHtml: string;
    runLoadHtml: string;
    stackLoadHtml: string;
  }

  let { healerSimpleHtml, healerNestedHtml, runLoadHtml, stackLoadHtml }: Props = $props();
</script>

<div class="code-switcher">
  <fieldset class="setup-tabs">
    <legend class="sr-only">Choose a setup example</legend>
    {#each exampleTabs as tab (tab.id)}
      {#if tab.id === 'simple'}
        <input
          type="radio"
          name="setup"
          id="setup-{tab.id}"
          value={tab.id}
          class="setup-input"
          checked
        />
      {:else}
        <input type="radio" name="setup" id="setup-{tab.id}" value={tab.id} class="setup-input" />
      {/if}
      <label for="setup-{tab.id}" class="setup-tab">
        <span class="setup-tab-label">{tab.label}</span>
        <span class="setup-tab-tagline">{tab.tagline}</span>
      </label>
    {/each}
  </fieldset>

  <div class="code-files">
    <div class="code-figure-slot code-figure-slot--lead">
      <div class="code-variant" data-setup="simple">
        <HighlightedCode html={healerSimpleHtml} filename={setupFilenames.healer} />
      </div>
      <div class="code-variant" data-setup="nested">
        <HighlightedCode html={healerNestedHtml} filename={setupFilenames.healer} />
      </div>
    </div>

    <div class="code-figure-slot code-figure-slot--trail">
      <div class="code-variant" data-setup="simple">
        <HighlightedCode html={runLoadHtml} filename={setupFilenames.runLoad} />
      </div>
      <div class="code-variant" data-setup="nested">
        <HighlightedCode html={stackLoadHtml} filename={setupFilenames.stackLoad} />
      </div>
    </div>
  </div>
</div>
