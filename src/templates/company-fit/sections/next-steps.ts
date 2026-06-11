import { T } from '../tokens.js';
import { esc } from '../utils.js';
import { sectionHead } from '../shared.js';

export function renderNextSteps(steps: Record<string, string> | undefined): string {
  if (!steps || !Object.keys(steps).length) return '';

  const lines = Object.entries(steps)
    .sort(([a], [b]) => Number(a) - Number(b))
    .map(([n, t]) => `[${n}] ${t}`)
    .join('\n');

  return (
    sectionHead('How can I help from here?', '', false) +
    `<pre style="white-space:pre-wrap;font-family:${T.sans};font-size:15px;` +
    `line-height:1.7;color:${T.fg};background:transparent;border:none;` +
    `padding:0;margin:0;">${esc(lines)}</pre>`
  );
}
