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

  let selectedSetup = $state('simple');
</script>

<div class="code-switcher" data-setup={selectedSetup}>
  <div class="setup-tabs" role="tablist" aria-label="Choose a setup example">
    {#each exampleTabs as tab (tab.id)}
      <button
        type="button"
        role="tab"
        id="setup-{tab.id}"
        class="setup-tab"
        aria-selected={selectedSetup === tab.id}
        onclick={() => (selectedSetup = tab.id)}
      >
        <span class="setup-tab-label">{tab.label}</span>
        <span class="setup-tab-tagline">{tab.tagline}</span>
      </button>
    {/each}
  </div>

  <div class="code-files">
    <div class="code-figure-slot code-figure-slot--lead">
      <div class="code-variant" data-setup="simple" hidden={selectedSetup !== 'simple'}>
        <HighlightedCode html={healerSimpleHtml} filename={setupFilenames.healer} />
      </div>
      <div class="code-variant" data-setup="nested" hidden={selectedSetup !== 'nested'}>
        <HighlightedCode html={healerNestedHtml} filename={setupFilenames.healer} />
      </div>
    </div>

    <div class="code-figure-slot code-figure-slot--trail">
      <div class="code-variant" data-setup="simple" hidden={selectedSetup !== 'simple'}>
        <HighlightedCode html={runLoadHtml} filename={setupFilenames.runLoad} />
      </div>
      <div class="code-variant" data-setup="nested" hidden={selectedSetup !== 'nested'}>
        <HighlightedCode html={stackLoadHtml} filename={setupFilenames.stackLoad} />
      </div>
    </div>
  </div>
</div>
