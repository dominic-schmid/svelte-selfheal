<script lang="ts">
  import { resolve } from '$app/paths';
  import { healer } from '$demo/healer.js';
  import type { PageData } from './$types.js';

  let { data }: { data: PageData } = $props();

  const articleSlug = (id: number, title: string): string => healer.createUrl(id, title);
</script>

<h1>Articles</h1>
<table class="pure-table pure-table-bordered">
  <thead>
    <tr>
      <th>ID</th>
      <th>Title</th>
      <th>SEO friendly URL</th>
      <th>ID URL</th>
    </tr>
  </thead>
  <tbody>
    {#each data.articles as { id, title } (id)}
      {@const slug = articleSlug(id, title)}
      <tr>
        <td>{id}</td>
        <td>{title}</td>
        <td>
          <a href={resolve(`/${slug}`)}>/{slug}</a>
        </td>
        <td>
          <a href={resolve(`/${String(id)}`)}>/{id}</a>
        </td>
      </tr>
    {/each}
  </tbody>
</table>
