<figure class="how-illustration">
  <figcaption class="illustration-label">One request</figcaption>
  <svg viewBox="0 0 720 248" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <text
      x="24"
      y="24"
      fill="hsl(var(--muted-foreground))"
      font-family="ui-sans-serif, sans-serif"
      font-size="11"
      font-weight="600"
      letter-spacing="0.08em">VISITOR LANDS ON</text
    >

    <rect x="24" y="34" width="672" height="48" rx="8" stroke="hsl(var(--border))" />
    <text
      x="40"
      y="64"
      fill="hsl(var(--muted-foreground))"
      font-family="ui-monospace, monospace"
      font-size="14">/</text
    >
    <rect
      x="54"
      y="44"
      width="286"
      height="28"
      rx="4"
      fill="hsl(var(--accent))"
      stroke="hsl(var(--border))"
      stroke-dasharray="5 4"
    />
    <text
      x="64"
      y="63"
      fill="hsl(var(--muted-foreground))"
      font-family="ui-monospace, monospace"
      font-size="13">wrong-spelling-article-title</text
    >
    <text
      x="348"
      y="64"
      fill="hsl(var(--muted-foreground))"
      font-family="ui-monospace, monospace"
      font-size="14">-</text
    >
    <rect
      x="362"
      y="44"
      width="28"
      height="28"
      rx="4"
      fill="hsl(var(--primary) / 0.18)"
      stroke="hsl(var(--primary))"
      stroke-width="1.5"
    />
    <text
      x="371"
      y="63"
      fill="hsl(var(--primary))"
      font-family="ui-monospace, monospace"
      font-size="14"
      font-weight="600">1</text
    >

    <text
      x="54"
      y="98"
      fill="hsl(var(--muted-foreground))"
      font-family="ui-sans-serif, sans-serif"
      font-size="10">slug — wrong is fine</text
    >
    <text
      x="362"
      y="98"
      fill="hsl(var(--primary))"
      font-family="ui-sans-serif, sans-serif"
      font-size="10">ID — you fetch this</text
    >

    <path d="M360 108v16" stroke="hsl(var(--border))" stroke-width="1.5" />
    <path d="M360 124l-4-3v6l4-3z" fill="hsl(var(--border))" />

    <rect
      x="64"
      y="136"
      width="148"
      height="32"
      rx="6"
      fill="hsl(var(--muted))"
      stroke="hsl(var(--border))"
    />
    <text
      x="76"
      y="157"
      fill="hsl(var(--foreground))"
      font-family="ui-sans-serif, sans-serif"
      font-size="12">① Parse ID → 1</text
    >

    <path d="M220 152h28" stroke="hsl(var(--border))" stroke-width="1.5" />
    <path d="M244 152l-4-3v6l4-3z" fill="hsl(var(--border))" />

    <rect
      x="256"
      y="136"
      width="148"
      height="32"
      rx="6"
      fill="hsl(var(--muted))"
      stroke="hsl(var(--border))"
    />
    <text
      x="268"
      y="157"
      fill="hsl(var(--foreground))"
      font-family="ui-sans-serif, sans-serif"
      font-size="12">② Fetch article</text
    >

    <path d="M412 152h28" stroke="hsl(var(--border))" stroke-width="1.5" />
    <path d="M436 152l-4-3v6l4-3z" fill="hsl(var(--border))" />

    <rect
      x="448"
      y="136"
      width="196"
      height="32"
      rx="6"
      fill="hsl(var(--muted))"
      stroke="hsl(var(--border))"
    />
    <text
      x="460"
      y="157"
      fill="hsl(var(--foreground))"
      font-family="ui-sans-serif, sans-serif"
      font-size="12">③ Slug off? → redirect</text
    >

    <path d="M360 176v14" stroke="hsl(var(--primary))" stroke-width="1.5" />
    <rect x="342" y="168" width="40" height="22" rx="4" fill="hsl(var(--primary) / 0.15)" />
    <text
      x="351"
      y="183"
      fill="hsl(var(--primary))"
      font-family="ui-monospace, monospace"
      font-size="11"
      font-weight="600">301</text
    >
    <path d="M360 196v10" stroke="hsl(var(--primary))" stroke-width="1.5" />
    <path d="M360 206l-4-3v6l4-3z" fill="hsl(var(--primary))" />

    <text
      x="130"
      y="204"
      fill="hsl(var(--primary))"
      font-family="ui-sans-serif, sans-serif"
      font-size="10"
      font-weight="600"
      letter-spacing="0.06em">CANONICAL URL</text
    >
    <rect
      x="130"
      y="210"
      width="566"
      height="32"
      rx="6"
      stroke="hsl(var(--primary) / 0.5)"
      fill="hsl(var(--primary) / 0.08)"
    />
    <text
      x="142"
      y="231"
      fill="hsl(var(--foreground))"
      font-family="ui-monospace, monospace"
      font-size="13">/the-article-title-1</text
    >
  </svg>
  <p class="how-illustration-caption">
    Page still loads from the ID — then one <strong>301</strong> to the single canonical path.
  </p>
</figure>
