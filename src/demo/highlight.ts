import { createHighlighter, type Highlighter } from 'shiki';

let highlighter: Highlighter | undefined;

const getHighlighter = async (): Promise<Highlighter> => {
  highlighter ??= await createHighlighter({
    themes: ['github-dark'],
    langs: ['typescript']
  });
  return highlighter;
};

export const highlightCode = async (code: string): Promise<string> => {
  const hl = await getHighlighter();
  const html = hl.codeToHtml(code, {
    lang: 'typescript',
    theme: 'github-dark'
  });

  // Shiki puts newlines between <span class="line"> nodes; with display:block that doubles spacing.
  return html.replace(/<\/span>\s*\n\s*<span class="line">/g, '</span><span class="line">');
};
