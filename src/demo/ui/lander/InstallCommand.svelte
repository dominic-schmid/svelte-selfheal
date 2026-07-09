<script lang="ts">
  import { packageManagers } from '$demo/install.js';

  let selectedPm = $state(packageManagers[0]?.id ?? 'pnpm');
</script>

<div class="install-cmd" data-pm={selectedPm}>
  <div class="install-tabs" role="tablist" aria-label="Package manager">
    {#each packageManagers as pm (pm.id)}
      <button
        type="button"
        role="tab"
        id="pm-{pm.id}"
        class="install-tab"
        aria-selected={selectedPm === pm.id}
        onclick={() => (selectedPm = pm.id)}
      >
        {pm.label}
      </button>
    {/each}
  </div>

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
        hidden={selectedPm !== pm.id}
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
