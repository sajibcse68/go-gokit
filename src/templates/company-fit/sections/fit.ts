import { T } from '../tokens.js';
import { esc, mdBold } from '../utils.js';
import { sectionHead } from '../shared.js';
import type { FitData } from '../types.js';

const PALETTE: Record<string, [string, string, string, string]> = {
  'good fit': [T.green, T.green_dark, T.green_15, T.green_50],
  borderline: [T.yellow, T.yellow_dark, T.yellow_15, T.yellow],
  'not a fit': [T.red, T.red, '#fbdee3', T.red],
};

function verdictBar(verdict: string, score: number | null | undefined): string {
  const [dot, ink, wash, edge] = PALETTE[verdict] ?? PALETTE['good fit'];

  const scoreHtml =
    score != null
      ? `<div style="font-family:${T.display};font-weight:700;font-size:28px;line-height:1;` +
        `color:${ink};font-variant-numeric:tabular-nums;display:flex;align-items:baseline;gap:3px;">` +
        `${esc(score)}<small style="font-size:14px;color:${T.fg_muted};font-weight:600;` +
        `font-family:${T.sans};">/10</small></div>`
      : '';

  return (
    `<div style="display:grid;grid-template-columns:auto 1fr auto;gap:12px;align-items:center;` +
    `padding:14px;background:${wash};border-bottom:1px solid ${edge};">` +
    `<span style="width:14px;height:14px;border-radius:50%;background:${dot};` +
    `box-shadow:0 0 0 4px rgba(15,168,148,.18);display:inline-block;"></span>` +
    `<div style="display:flex;flex-direction:column;">` +
    `<span style="font-size:11px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:${ink};">Verdict</span>` +
    `<span style="font-size:16px;font-weight:700;color:${T.fg};text-transform:capitalize;">${esc(verdict)}</span>` +
    `</div>${scoreHtml}</div>`
  );
}

function verdictLegend(activeVerdict: string): string {
  const entries: Array<[string, string]> = [
    ['Good fit', 'good fit'],
    ['Borderline', 'borderline'],
    ['Not a fit', 'not a fit'],
  ];
  const pips = entries.map(([label, key]) => {
    const [dot] = PALETTE[key];
    const active = key === activeVerdict;
    return (
      `<span style="display:inline-flex;align-items:center;gap:6px;${active ? '' : 'opacity:.5;'}` +
      `font-size:11px;line-height:1;color:${active ? T.fg : T.fg_muted};` +
      `font-weight:${active ? '600' : '400'};padding:4px 8px;border-radius:${T.r_pill};` +
      `background:${active ? T.gray_5 : T.white};` +
      `border:1px solid ${active ? T.gray_10 : T.border};white-space:nowrap;">` +
      `<i style="width:8px;height:8px;border-radius:50%;background:${dot};display:block;flex-shrink:0;"></i>` +
      `${esc(label)}</span>`
    );
  });
  return `<div style="display:flex;gap:6px;margin-top:8px;">${pips.join('')}</div>`;
}

export function renderFit(fit: FitData): string {
  const verdict = (fit.verdict ?? 'good fit').toLowerCase();
  const bar = verdictBar(verdict, fit.score);
  const legend = verdictLegend(verdict);

  const summary = fit.rationale
    ? `<div style="padding:14px;font-size:14px;line-height:1.5;color:${T.fg};">${mdBold(fit.rationale)}${legend}</div>`
    : `<div style="padding:14px;">${legend}</div>`;

  return (
    sectionHead('Fit') +
    `<div style="border:1px solid ${T.border};border-radius:${T.r_md};overflow:hidden;background:${T.white};">` +
    `${bar}${summary}</div>`
  );
}
