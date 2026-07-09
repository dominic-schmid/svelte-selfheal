<script lang="ts">
  import { packageManagers } from '$demo/install.js';
</script>

<div class="install-cmd">
  <fieldset class="install-tabs">
    <legend class="sr-only">Package manager</legend>
    {#each packageManagers as pm, index (pm.id)}
      {#if index === 0}
        <input type="radio" name="pm" id="pm-{pm.id}" value={pm.id} class="install-input" checked />
      {:else}
        <input type="radio" name="pm" id="pm-{pm.id}" value={pm.id} class="install-input" />
      {/if}
      <label for="pm-{pm.id}" class="install-tab">{pm.label}</label>
    {/each}
  </fieldset>

  <div class="install-command-field">
    <span class="install-prompt" aria-hidden="true">$</span>
    {#each packageManagers as pm (pm.id)}
      <input
        type="text"
        readonly
        value={pm.command}
        class="install-command-input"
        data-pm={pm.id}
        spellcheck="false"
        autocomplete="off"
        autocorrect="off"
        autocapitalize="off"
        aria-label="Install command for {pm.label}"
      />
    {/each}
  </div>

  <button type="button" class="install-copy" data-state="idle" aria-label="Copy install command">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="install-copy-icon"
      aria-hidden="true"
    >
      <g class="install-copy-glyph install-copy-glyph--idle">
        <rect x="9" y="9" width="13" height="13" rx="2" />
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
      </g>
      <g class="install-copy-glyph install-copy-glyph--done">
        <path d="M20 6 9 17l-5-5" class="install-copy-check" />
      </g>
    </svg>
  </button>

  <p id="install-copy-status" class="sr-only" aria-live="polite"></p>
</div>
