import { paragraphs } from '../utils.js';
import { sectionHead } from '../shared.js';
import type { FreetextItem } from '../types.js';

export function renderFreetext(items: FreetextItem[] | undefined): string {
  if (!items?.length) return '';
  return items
    .filter((it) => it.heading || it.body)
    .map(
      (it) =>
        sectionHead(it.heading ?? '') +
        `<div style="font-size:14px;line-height:1.6;">${paragraphs(it.body ?? '')}</div>`,
    )
    .join('');
}
