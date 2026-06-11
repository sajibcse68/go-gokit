import { T } from '../tokens.js';
import { esc, mdBold, paragraphs, fmtDate } from '../utils.js';
import { sectionHead } from '../shared.js';
import { CAL_SVG, EXT_SVG } from '../icons.js';
import type { WhyNowItem } from '../types.js';

const HEAT_LABELS: Record<string, string> = { hot: 'Hot', warm: 'Warm', mild: 'Mild' };

function signalCard(it: WhyNowItem): string {
  const imp = (it.importance ?? 'warm').toLowerCase();
  const isHot = imp === 'hot';

  const wash = isHot ? T.violet_15 : T.white;
  const border = isHot ? T.violet_50 : T.border;
  const iconBg = isHot ? T.violet : T.violet_15;
  const iconFg = isHot ? T.white : T.violet_dark;
  const heatBg = isHot ? T.violet : T.yellow_15;
  const heatFg = isHot ? T.white : T.yellow_dark;
  const heatLabel = HEAT_LABELS[imp] ?? 'Warm';

  const url = it.url ?? '';
  const titleHtml = url
    ? `<a href="${esc(url)}" target="_blank" rel="noopener" ` +
      `style="font-size:15px;line-height:1.3;font-weight:700;color:${T.fg};` +
      `margin:2px 0 4px;display:block;text-decoration:none;">` +
      `${mdBold(it.title ?? '')} ${EXT_SVG}</a>`
    : `<div style="font-size:15px;line-height:1.3;font-weight:700;color:${T.fg};margin:2px 0 4px;">` +
      `${mdBold(it.title ?? '')}</div>`;

  const bodyHtml = paragraphs(it.body ?? '');
  const moreSection = bodyHtml
    ? `<details style="margin-top:6px;display:flex;flex-direction:column;align-items:flex-start;" data-toggle-order>` +
      `<summary style="order:2;list-style:none;cursor:pointer;display:inline-flex;align-items:center;gap:6px;` +
      `font-family:${T.mono};font-size:11px;font-weight:600;letter-spacing:.06em;` +
      `text-transform:uppercase;color:${T.violet_dark};padding:4px 8px;border-radius:${T.r_sm};` +
      `background:rgba(255,255,255,.55);border:1px solid ${T.violet_50};outline:none;">` +
      `<span data-closed>Show more</span><span data-open style="display:none;">Show less</span>` +
      `<span data-chev style="width:7px;height:7px;border-right:1.5px solid currentColor;` +
      `border-bottom:1.5px solid currentColor;transform:rotate(45deg) translate(-1px,-1px);"></span>` +
      `</summary>` +
      `<div style="padding:10px 0 2px;font-size:14px;line-height:1.5;color:${T.fg};` +
      `display:flex;flex-direction:column;gap:8px;">${bodyHtml}</div>` +
      `</details>`
    : '';

  return (
    `<div style="display:grid;grid-template-columns:auto 1fr auto;gap:12px;` +
    `align-items:flex-start;padding:14px;background:${wash};` +
    `border:1px solid ${border};border-radius:${T.r_md};">` +
    `<div style="width:36px;height:36px;border-radius:${T.r_sm};background:${iconBg};` +
    `color:${iconFg};display:inline-flex;align-items:center;justify-content:center;">${CAL_SVG}</div>` +
    `<div>` +
    `<div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-bottom:2px;">` +
    `<span style="font-family:${T.mono};font-size:11px;color:${T.fg_muted};">${fmtDate(it.date ?? '')}</span></div>` +
    `${titleHtml}` +
    `<div style="font-size:14px;line-height:1.5;color:${T.fg_muted};">${mdBold(it.abstract ?? '')}</div>` +
    `${moreSection}` +
    `</div>` +
    `<span style="font-family:${T.mono};font-size:11px;font-weight:700;letter-spacing:.04em;` +
    `text-transform:uppercase;padding:3px 8px;border-radius:${T.r_pill};` +
    `background:${heatBg};color:${heatFg};white-space:nowrap;align-self:flex-start;flex-shrink:0;">` +
    `${heatLabel}</span>` +
    `</div>`
  );
}

export function renderWhyNow(items: WhyNowItem[] | undefined): string {
  if (!items?.length) return '';
  const count = `${items.length} signal${items.length === 1 ? '' : 's'} · last 90 days`;
  return (
    sectionHead('Why now', count) +
    `<div style="display:flex;flex-direction:column;gap:8px;">${items.map(signalCard).join('')}</div>`
  );
}
