import { T } from './tokens.js';
import { esc } from './utils.js';

export function sectionHead(title: string, count = '', uppercase = true): string {
  const countHtml = count
    ? `<span style="margin-left:auto;font-family:${T.mono};font-size:11px;color:${T.fg_muted};">${esc(count)}</span>`
    : '';
  const tt = uppercase ? 'text-transform:uppercase;' : '';
  return (
    `<div style="display:flex;align-items:baseline;gap:10px;margin:16px 0 8px;">` +
    `<h2 style="margin:0;font-size:14px;font-weight:700;letter-spacing:.02em;${tt}color:${T.fg_muted};">${esc(title)}</h2>` +
    `${countHtml}</div>`
  );
}

export function iconBtn(
  href: string,
  color: string,
  svg: string,
  title: string,
  disabled: boolean,
): string {
  const common =
    `width:32px;height:32px;border-radius:${T.r_sm};` +
    `background:${T.gray_5};border:1px solid ${T.border};` +
    `display:inline-flex;align-items:center;justify-content:center;` +
    `text-decoration:none;color:${color};`;
  if (disabled) {
    return `<span title="${esc(title)}" style="${common}opacity:.4;cursor:default;">${svg}</span>`;
  }
  return `<a href="${esc(href)}" title="${esc(title)}" style="${common}">${svg}</a>`;
}
