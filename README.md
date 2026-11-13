# Markdown Live

**Write Markdown, see it rendered, copy or download the HTML. Offline.**

**[Live: https://quantumcoder-14.github.io/markdown-live/](https://quantumcoder-14.github.io/markdown-live/)** — nothing to install.

One self-contained `index.html`. No build step, no framework, no dependencies to install.

## What it does

Type Markdown on the left, see the rendered result on the right. Supports headings, bold,
italic, strikethrough, inline code, fenced code blocks, links, ordered and unordered lists,
blockquotes, horizontal rules and paragraphs.

**Copy HTML** takes the generated markup. **Download .html** gives you a standalone file with
styles already inlined, ready to send or print.

Your draft is saved in `localStorage` so a refresh does not lose it — in that browser only.

## The security decision

Markdown renderers that concatenate strings are an injection hole: paste
`<img src=x onerror=alert(1)>` into a naive one and it runs. Here the text is **HTML-escaped
first**, then the Markdown substitutions are applied on top, so a `<script>` tag in your
source can only ever appear as visible text. There is a test asserting exactly that.

## Local only

No server. Nothing is uploaded; the preview is built in the page. Works from a saved file with
no connection at all.

## Tests

```bash
node tests/test.js     # 22 assertions
```

Headings, paragraphs, inline formatting, lists, blockquotes, code fences, and the XSS case
above.

## Run it

Open `index.html`, or host it anywhere static. To publish on GitHub Pages: **Settings →
Pages → Deploy from a branch → `main` → `/ (root)`**.

## Licence

MIT with Commons Clause. Copyright (c) 2026 Siddhant Neekhra. See [LICENSE.md](LICENSE.md).
