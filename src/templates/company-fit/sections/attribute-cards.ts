import { T } from '../tokens.js';
import { esc, mdBold } from '../utils.js';
import { sectionHead } from '../shared.js';
import type { AttributeItem } from '../types.js';

function whyCards(items: AttributeItem[], borderColor: string, heading: string): string {
  if (!items.length) return '';

  const cards = items.map(
    (it, i) =>
      `<article style="flex:0 0 min(240px,calc(50% - 4px));scroll-snap-align:start;background:${T.white};` +
      `border:1.5px solid ${borderColor};border-radius:${T.r_md};padding:14px;` +
      `display:flex;flex-direction:column;gap:8px;position:relative;">` +
      `<span style="position:absolute;top:10px;right:12px;font-family:${T.mono};` +
      `font-size:11px;color:${T.fg_muted};font-weight:600;letter-spacing:.04em;">` +
      `${String(i + 1).padStart(2, '0')}</span>` +
      `<div style="font-size:15px;line-height:1.3;font-weight:700;color:${T.fg};padding-right:24px;">` +
      `${esc(it.attribute_name)}</div>` +
      `<div style="font-size:14px;line-height:1.5;color:${T.fg_muted};">` +
      `${mdBold(it.attribute_description ?? '')}</div></article>`,
  );

  const count = `${items.length} attribute${items.length === 1 ? '' : 's'} · swipe →`;
  return (
    sectionHead(heading, count) +
    `<div data-cards style="display:flex;gap:8px;overflow-x:auto;overflow-y:hidden;` +
    `scroll-snap-type:x proximity;scroll-padding-left:16px;padding:4px 0 0;">` +
    `${cards.join('')}</div>`
  );
}

export function renderWhyItFits(items: AttributeItem[] | undefined): string {
  return whyCards(items ?? [], T.green_50, 'Why it fits');
}

export function renderFitGaps(items: AttributeItem[] | undefined, verdict: string): string {
  const borderColor = verdict === 'not a fit' ? T.red : T.yellow;
  const heading = verdict === 'not a fit' ? 'Bad-fit signals' : 'Fit gaps';
  return whyCards(items ?? [], borderColor, heading);
}
