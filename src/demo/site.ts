/** External URLs and labels for the demo site — import here, never copy-paste. */
export const siteLinks = {
  github: {
    href: 'https://github.com/dominic-schmid/svelte-selfheal',
    label: 'GitHub'
  },
  npm: {
    href: 'https://www.npmjs.com/package/svelte-selfheal',
    label: 'npm'
  },
  docs: {
    href: 'https://github.com/dominic-schmid/svelte-selfheal#readme',
    label: 'Full docs on GitHub',
    shortLabel: 'Docs'
  },
  x: {
    href: 'https://x.com/smddmnc',
    handle: '@smddmnc',
    displayName: 'domme'
  },
  defaultsTree: 'https://github.com/dominic-schmid/svelte-selfheal/tree/main/src/lib/defaults',
  examples: {
    tree: 'https://github.com/dominic-schmid/svelte-selfheal/tree/main/examples',
    label: 'Examples in repo'
  },
  aaronFrancis: {
    href: 'https://x.com/aarondfrancis',
    name: 'Aaron Francis',
    videoId: 'a6lnfyES-LA',
    videoTitle: 'Self-healing URLs in Laravel'
  }
} as const;
