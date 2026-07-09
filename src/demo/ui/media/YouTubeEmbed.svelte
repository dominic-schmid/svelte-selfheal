<script lang="ts">
  interface Props {
    videoId: string;
    title: string;
  }

  let { videoId, title }: Props = $props();

  const watchUrl = $derived(`https://www.youtube.com/watch?v=${videoId}`);
  const posterUrl = $derived(`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`);
</script>

<!-- eslint-disable svelte/no-navigation-without-resolve -- External YouTube URL -->
<a class="video-poster" href={watchUrl} target="_blank" rel="noopener noreferrer">
  <img
    src={posterUrl}
    alt=""
    width="720"
    height="405"
    loading="lazy"
    decoding="async"
    class="video-poster-image"
  />
  <span class="video-poster-play" aria-hidden="true"></span>
  <span class="video-poster-label">{title}</span>
  <span class="sr-only">Watch {title} on YouTube (opens in new tab)</span>
</a>
<!-- eslint-enable svelte/no-navigation-without-resolve -->
