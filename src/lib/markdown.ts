// ==========================================
// Tiny, safe Markdown -> HTML converter for blog posts (no extra package needed).
// All text is HTML-escaped FIRST, then Markdown symbols are turned into tags,
// so a post can never inject scripts or raw HTML.
//
// Supported: # headings, **bold**, *italic*, ~~strike~~, `code`, ``` code blocks ```,
//            [links](https://...), ![images](https://...), > quotes, - lists, 1. lists, ---
// ==========================================

const escapeHtml = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

// Only allow normal web links. javascript: and data: links are rejected.
function safeUrl(raw: string): string | null {
  const url = raw.trim();
  if (!/^(https?:\/\/|mailto:|\/|#)/i.test(url)) return null;
  return url.replace(/\*/g, "%2A").replace(/_/g, "%5F").replace(/~/g, "%7E");
}

function inline(source: string): string {
  const codes: string[] = [];
  // 1) take `inline code` out first so its content is not formatted
  let t = source.replace(/`([^`]+)`/g, (_m, c: string) => {
    codes.push(`<code>${escapeHtml(c)}</code>`);
    return `\u0000${codes.length - 1}\u0000`;
  });
  // 2) escape everything else
  t = escapeHtml(t);
  // 3) images and links
  t = t.replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, (_m, alt: string, url: string) => {
    const u = safeUrl(url);
    return u
      ? `<img src="${u}" alt="${alt.replace(/[*_~]/g, "")}" loading="lazy" />`
      : alt;
  });
  t = t.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_m, label: string, url: string) => {
    const u = safeUrl(url);
    if (!u) return label;
    const external = /^https?:/i.test(u);
    return `<a href="${u}"${external ? ' target="_blank" rel="noopener noreferrer"' : ""}>${label}</a>`;
  });
  // 4) bold, italic, strike
  t = t
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/(^|[^*])\*([^*\s][^*]*)\*/g, "$1<em>$2</em>")
    .replace(/~~([^~]+)~~/g, "<s>$1</s>");
  // 5) put the code back
  return t.replace(/\u0000(\d+)\u0000/g, (_m, i: string) => codes[Number(i)]);
}

const isBlockStart = (line: string) =>
  /^(#{1,4}\s|```|>\s?|\s*[-*]\s+|\s*\d+\.\s+|---+\s*$)/.test(line);

export function renderMarkdown(markdown: string): string {
  const lines = markdown.replace(/\r\n?/g, "\n").split("\n");
  const out: string[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // code block
    if (/^```/.test(line)) {
      const buf: string[] = [];
      i++;
      while (i < lines.length && !/^```\s*$/.test(lines[i])) {
        buf.push(lines[i]);
        i++;
      }
      i++;
      out.push(`<pre><code>${escapeHtml(buf.join("\n"))}</code></pre>`);
      continue;
    }

    if (/^\s*$/.test(line)) {
      i++;
      continue;
    }

    // headings: "#" becomes h2 because the post title is already the h1
    const h = line.match(/^(#{1,4})\s+(.+)$/);
    if (h) {
      const level = Math.min(h[1].length + 1, 4);
      out.push(`<h${level}>${inline(h[2])}</h${level}>`);
      i++;
      continue;
    }

    if (/^---+\s*$/.test(line)) {
      out.push("<hr />");
      i++;
      continue;
    }

    // quote
    if (/^>\s?/.test(line)) {
      const buf: string[] = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) {
        buf.push(lines[i].replace(/^>\s?/, ""));
        i++;
      }
      out.push(`<blockquote>${inline(buf.join(" "))}</blockquote>`);
      continue;
    }

    // bullet list
    if (/^\s*[-*]\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) {
        items.push(`<li>${inline(lines[i].replace(/^\s*[-*]\s+/, ""))}</li>`);
        i++;
      }
      out.push(`<ul>${items.join("")}</ul>`);
      continue;
    }

    // numbered list
    if (/^\s*\d+\.\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) {
        items.push(`<li>${inline(lines[i].replace(/^\s*\d+\.\s+/, ""))}</li>`);
        i++;
      }
      out.push(`<ol>${items.join("")}</ol>`);
      continue;
    }

    // paragraph (consecutive lines stay together, a new line becomes a line break)
    const buf: string[] = [line];
    i++;
    while (i < lines.length && !/^\s*$/.test(lines[i]) && !isBlockStart(lines[i])) {
      buf.push(lines[i]);
      i++;
    }
    out.push(`<p>${buf.map(inline).join("<br />")}</p>`);
  }

  return out.join("\n");
}
