function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function inline(s: string): string {
  let out = escapeHtml(s);
  // links [text](url)
  out = out.replace(
    /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
    (_, text: string, url: string) =>
      `<a href="${url}" target="_blank" rel="noopener noreferrer">${text}</a>`,
  );
  // images ![alt](url)
  out = out.replace(
    /!\[([^\]]*)\]\((\/uploads\/[^\s)]+|\/images\/[^\s)]+)\)/g,
    (_, alt: string, url: string) =>
      `<img src="${url}" alt="${alt}" loading="lazy" class="my-4 rounded-md border border-navy-900/10">`,
  );
  // bold
  out = out.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  // italic
  out = out.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  // inline code
  out = out.replace(/`([^`]+)`/g, '<code class="rounded bg-navy-950/5 px-1.5 py-0.5 text-[0.9em]">$1</code>');
  return out;
}

export function renderMarkdown(md: string): string {
  const lines = md.replace(/\r\n/g, '\n').split('\n');
  const blocks: string[] = [];
  const inlineIsEmpty = (arr: string[]) => arr.filter((l) => l.trim() !== '').length === 0;

  let para: string[] = [];
  let list: { type: 'ul' | 'ol'; items: string[] } | null = null;

  const flush = () => {
    if (list) {
      const tag = list.type === 'ul' ? 'ul' : 'ol';
      blocks.push(`<${tag}>${list.items.map((i) => `<li>${i}</li>`).join('')}</${tag}>`);
      list = null;
    }
    if (!inlineIsEmpty(para)) {
      blocks.push(`<p>${para.map(inline).join('<br>')}</p>`);
      para = [];
    }
  };

  for (const raw of lines) {
    const line = raw.trim();
    if (line === '') {
      flush();
      continue;
    }
    if (line === '---') {
      flush();
      blocks.push('<hr>');
      continue;
    }
    const heading = /^(#{1,6})\s+(.*)$/.exec(line);
    if (heading) {
      flush();
      const level = heading[1].length;
      blocks.push(`<h${level}>${inline(heading[2])}</h${level}>`);
      continue;
    }
    const quote = /^>\s?(.*)$/.exec(line);
    if (quote) {
      flush();
      blocks.push(`<blockquote>${inline(quote[1])}</blockquote>`);
      continue;
    }
    const ul = /^[-*]\s+(.*)$/.exec(line);
    const ol = /^\d+[.)]\s+(.*)$/.exec(line);
    if (ul || ol) {
      const type = ul ? 'ul' : 'ol';
      const item = inline((ul ?? ol)![1]);
      if (list && list.type !== type) {
        flush();
      }
      if (!list) list = { type, items: [] };
      list.items.push(item);
      continue;
    }
    para.push(line);
  }
  flush();

  if (blocks.length === 0) return `<p></p>`;
  return blocks.join('\n');
}