import { setupSnippets } from '$demo/copy.js';
import { highlightCode } from '$demo/highlight.js';
import type { PageServerLoad } from './$types.js';

export const load = (async () => {
  const [healerSimpleHtml, healerNestedHtml, runLoadHtml, stackLoadHtml] = await Promise.all([
    highlightCode(setupSnippets.healerSimple),
    highlightCode(setupSnippets.healerNested),
    highlightCode(setupSnippets.runLoad),
    highlightCode(setupSnippets.stackLoad)
  ]);

  return {
    healerSimpleHtml,
    healerNestedHtml,
    runLoadHtml,
    stackLoadHtml
  };
}) satisfies PageServerLoad;
