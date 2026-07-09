<script lang="ts">
  import GitHubLink from '$demo/ui/links/GitHubLink.svelte';
  import { strategyGroups } from '$demo/copy.js';
</script>

<div class="strategy-catalog">
  {#each strategyGroups as group (group.step)}
    <section class="strategy-block" aria-labelledby="strategy-{group.step}">
      <header class="strategy-caption">
        <h3 class="strategy-caption-title" id="strategy-{group.step}">{group.title}</h3>
        <p class="strategy-caption-hook"><code>{group.when}</code></p>
      </header>

      <ul class="strategy-rows">
        {#each group.preview as strategy (strategy.name)}
          <li class="strategy-row">
            <code class="strategy-row-name">{strategy.name}</code>
            <span class="strategy-row-example">{strategy.example}</span>
          </li>
        {/each}
      </ul>

      <footer class="strategy-foot">
        <p class="strategy-foot-note">{group.footNote}</p>
        <GitHubLink
          href={group.github}
          label="{group.moreLabel} →"
          ariaLabel="{group.moreLabel} in defaults on GitHub (opens in new tab)"
          class="strategy-foot-link"
        />
      </footer>
    </section>
  {/each}
</div>
