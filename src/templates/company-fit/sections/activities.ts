import { T } from '../tokens.js';
import { esc, paragraphs } from '../utils.js';
import { sectionHead } from '../shared.js';
import type { Activity } from '../types.js';

const CHEV =
  `<span data-chev style="flex-shrink:0;width:7px;height:7px;` +
  `border-right:1.5px solid ${T.fg_muted};border-bottom:1.5px solid ${T.fg_muted};` +
  `transform:rotate(45deg) translate(-1px,-1px);"></span>`;

function activityRow(it: Activity): string {
  const dateSpan = `<span style="font-family:${T.mono};font-size:12px;color:${T.fg_muted};white-space:nowrap;">${esc(it.date ?? '')}</span>`;
  const detail = paragraphs(it.detail ?? '');

  if (detail) {
    return (
      `<details style="border:1px solid ${T.border};border-radius:${T.r_md};` +
      `background:${T.white};overflow:hidden;">` +
      `<summary style="list-style:none;cursor:pointer;padding:10px 14px;` +
      `display:flex;align-items:center;gap:8px;outline:none;">` +
      `${dateSpan}` +
      `<span style="color:${T.fg_muted};font-size:13px;flex-shrink:0;">·</span>` +
      `<span style="font-size:14px;font-weight:600;color:${T.fg};flex:1;">${esc(it.summary ?? '')}</span>` +
      `${CHEV}` +
      `</summary>` +
      `<div style="padding:10px 14px 14px;font-size:14px;line-height:1.5;color:${T.fg};` +
      `border-top:1px solid ${T.border};">${detail}</div>` +
      `</details>`
    );
  }

  return (
    `<div style="border:1px solid ${T.border};border-radius:${T.r_md};` +
    `background:${T.white};padding:10px 14px;display:flex;align-items:center;gap:8px;">` +
    `${dateSpan}` +
    `<span style="color:${T.fg_muted};font-size:13px;flex-shrink:0;">·</span>` +
    `<span style="font-size:14px;font-weight:600;color:${T.fg};">${esc(it.summary ?? '')}</span>` +
    `</div>`
  );
}

export function renderLastActivities(items: Activity[] | undefined): string {
  if (!items?.length) return '';

  const sorted = [...items].sort((a, b) => ((b.date ?? '') > (a.date ?? '') ? 1 : -1));
  const visible = sorted.slice(0, 4);
  const rest = sorted.slice(4);

  const rowHtmls = visible.map(activityRow);

  if (rest.length) {
    rowHtmls.push(
      `<details>` +
        `<summary style="list-style:none;cursor:pointer;display:inline-flex;` +
        `align-items:center;gap:6px;font-family:${T.mono};font-size:11px;` +
        `font-weight:600;letter-spacing:.06em;text-transform:uppercase;` +
        `color:${T.fg_muted};padding:4px 8px;border-radius:${T.r_sm};` +
        `background:${T.gray_5};border:1px solid ${T.border};outline:none;">` +
        `Show ${rest.length} more` +
        `<span data-chev style="width:7px;height:7px;border-right:1.5px solid currentColor;` +
        `border-bottom:1.5px solid currentColor;` +
        `transform:rotate(45deg) translate(-1px,-1px);"></span>` +
        `</summary>` +
        `<div style="display:flex;flex-direction:column;gap:8px;margin-top:8px;">${rest.map(activityRow).join('')}</div>` +
        `</details>`,
    );
  }

  const n = sorted.length;
  return (
    sectionHead('Last activities', `${n} activit${n === 1 ? 'y' : 'ies'}`) +
    `<div style="display:flex;flex-direction:column;gap:8px;">${rowHtmls.join('')}</div>`
  );
}
