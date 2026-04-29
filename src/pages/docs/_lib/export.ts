import type { JSONContent } from '@tiptap/react';

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function inlineMarksToMd(node: JSONContent): string {
  let text = node.text ?? '';
  if (!node.marks?.length) return text;
  for (const mark of node.marks) {
    switch (mark.type) {
      case 'bold':
        text = `**${text}**`;
        break;
      case 'italic':
        text = `*${text}*`;
        break;
      case 'code':
        text = `\`${text}\``;
        break;
      case 'strike':
        text = `~~${text}~~`;
        break;
      case 'underline':
        text = `<u>${text}</u>`;
        break;
      case 'link':
        text = `[${text}](${mark.attrs?.href ?? '#'})`;
        break;
    }
  }
  return text;
}

function inlineMarksToHtml(node: JSONContent): string {
  let text = escapeHtml(node.text ?? '');
  if (!node.marks?.length) return text;
  for (const mark of node.marks) {
    switch (mark.type) {
      case 'bold':
        text = `<strong>${text}</strong>`;
        break;
      case 'italic':
        text = `<em>${text}</em>`;
        break;
      case 'code':
        text = `<code>${text}</code>`;
        break;
      case 'strike':
        text = `<del>${text}</del>`;
        break;
      case 'underline':
        text = `<u>${text}</u>`;
        break;
      case 'link':
        text = `<a href="${escapeHtml(mark.attrs?.href ?? '#')}">${text}</a>`;
        break;
    }
  }
  return text;
}

export function toMarkdown(content: JSONContent): string {
  const out: string[] = [];
  const walk = (node: JSONContent | undefined, depth = 0): string => {
    if (!node) return '';
    switch (node.type) {
      case 'doc':
        return (node.content ?? []).map((c) => walk(c, depth)).join('\n\n');
      case 'paragraph':
        return (node.content ?? []).map(inlineMarksToMd).join('');
      case 'heading': {
        const level = Math.max(1, Math.min(6, Number(node.attrs?.level ?? 1)));
        return `${'#'.repeat(level)} ${(node.content ?? []).map(inlineMarksToMd).join('')}`;
      }
      case 'bulletList':
        return (node.content ?? [])
          .map((li) => `${'  '.repeat(depth)}- ${walk(li, depth + 1).trimStart()}`)
          .join('\n');
      case 'orderedList':
        return (node.content ?? [])
          .map((li, i) => `${'  '.repeat(depth)}${i + 1}. ${walk(li, depth + 1).trimStart()}`)
          .join('\n');
      case 'taskList':
        return (node.content ?? [])
          .map((li) => {
            const checked = li.attrs?.checked ? 'x' : ' ';
            return `${'  '.repeat(depth)}- [${checked}] ${(li.content ?? [])
              .map((c) => walk(c, depth + 1))
              .join('')
              .trimStart()}`;
          })
          .join('\n');
      case 'listItem':
      case 'taskItem':
        return (node.content ?? []).map((c) => walk(c, depth)).join('\n');
      case 'blockquote':
        return (node.content ?? [])
          .map((c) => `> ${walk(c, depth)}`)
          .join('\n');
      case 'codeBlock': {
        const lang = node.attrs?.language ?? '';
        const code = (node.content ?? []).map((c) => c.text ?? '').join('');
        return `\`\`\`${lang}\n${code}\n\`\`\``;
      }
      case 'horizontalRule':
        return '---';
      case 'hardBreak':
        return '  \n';
      case 'image': {
        const src = node.attrs?.src ?? '';
        const alt = node.attrs?.alt ?? '';
        return `![${alt}](${src})`;
      }
      case 'text':
        return inlineMarksToMd(node);
      default:
        return (node.content ?? []).map((c) => walk(c, depth)).join('');
    }
  };
  out.push(walk(content));
  return out.join('').trim() + '\n';
}

export function toHtml(content: JSONContent, title = 'Document'): string {
  const walk = (node: JSONContent | undefined): string => {
    if (!node) return '';
    switch (node.type) {
      case 'doc':
        return (node.content ?? []).map(walk).join('');
      case 'paragraph':
        return `<p>${(node.content ?? []).map(inlineMarksToHtml).join('')}</p>`;
      case 'heading': {
        const level = Math.max(1, Math.min(6, Number(node.attrs?.level ?? 1)));
        return `<h${level}>${(node.content ?? []).map(inlineMarksToHtml).join('')}</h${level}>`;
      }
      case 'bulletList':
        return `<ul>${(node.content ?? []).map(walk).join('')}</ul>`;
      case 'orderedList':
        return `<ol>${(node.content ?? []).map(walk).join('')}</ol>`;
      case 'listItem':
        return `<li>${(node.content ?? []).map(walk).join('')}</li>`;
      case 'taskList':
        return `<ul class="task-list">${(node.content ?? []).map(walk).join('')}</ul>`;
      case 'taskItem':
        return `<li class="task-item"><input type="checkbox" ${node.attrs?.checked ? 'checked' : ''} disabled />${(node.content ?? [])
          .map(walk)
          .join('')}</li>`;
      case 'blockquote':
        return `<blockquote>${(node.content ?? []).map(walk).join('')}</blockquote>`;
      case 'codeBlock': {
        const lang = node.attrs?.language ?? '';
        const code = (node.content ?? []).map((c) => escapeHtml(c.text ?? '')).join('');
        return `<pre><code class="language-${escapeHtml(lang)}">${code}</code></pre>`;
      }
      case 'horizontalRule':
        return '<hr/>';
      case 'hardBreak':
        return '<br/>';
      case 'image':
        return `<img src="${escapeHtml(node.attrs?.src ?? '')}" alt="${escapeHtml(node.attrs?.alt ?? '')}" />`;
      case 'text':
        return inlineMarksToHtml(node);
      default:
        return (node.content ?? []).map(walk).join('');
    }
  };
  return `<!doctype html><html><head><meta charset="utf-8"/><title>${escapeHtml(title)}</title>
<style>body{font-family:system-ui,-apple-system,sans-serif;max-width:760px;margin:2rem auto;padding:0 1rem;line-height:1.6;color:#111}pre{background:#f6f7f9;padding:1rem;border-radius:8px;overflow:auto}code{font-family:ui-monospace,monospace}blockquote{border-left:3px solid #ddd;padding-left:1rem;color:#555;margin-left:0}img{max-width:100%}</style>
</head><body><h1>${escapeHtml(title)}</h1>${walk(content)}</body></html>`;
}

export function toPlainText(content: JSONContent): string {
  const out: string[] = [];
  const walk = (node: JSONContent | undefined) => {
    if (!node) return;
    if (node.type === 'text') {
      out.push(node.text ?? '');
      return;
    }
    if (node.type === 'paragraph' || node.type === 'heading' || node.type === 'listItem' || node.type === 'taskItem') {
      (node.content ?? []).forEach(walk);
      out.push('\n');
      return;
    }
    if (node.type === 'hardBreak') out.push('\n');
    (node.content ?? []).forEach(walk);
  };
  walk(content);
  return out.join('').replace(/\n{3,}/g, '\n\n').trim();
}

export function downloadBlob(filename: string, mime: string, data: string) {
  const blob = new Blob([data], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
