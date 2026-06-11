import { T } from './tokens.js';
import { isEmpty } from './utils.js';
import { INTERACTIVE_CSS } from './interactive-css.js';
import { renderFit } from './sections/fit.js';
import { renderWhyItFits, renderFitGaps } from './sections/attribute-cards.js';
import { renderWhyNow } from './sections/why-now.js';
import { renderContacts } from './sections/contacts.js';
import { renderLastActivities } from './sections/activities.js';
import { renderFreetext } from './sections/freetext.js';
import { renderNextSteps } from './sections/next-steps.js';
import type { NotesPayload, FitData, AttributeItem } from './types.js';

type SectionKey = keyof NotesPayload;

const SECTIONS: Array<{ key: SectionKey; render?: (v: unknown, verdict: string) => string }> = [
  { key: 'fit' },
  { key: 'freetext_after_fit', render: (v) => renderFreetext(v as NotesPayload['freetext_after_fit']) },
  { key: 'why_it_fits', render: (v) => renderWhyItFits(v as AttributeItem[]) },
  { key: 'fit_gaps', render: (v, verdict) => renderFitGaps(v as AttributeItem[], verdict) },
  { key: 'freetext_after_why_it_fits', render: (v) => renderFreetext(v as NotesPayload['freetext_after_why_it_fits']) },
  { key: 'why_now', render: (v) => renderWhyNow(v as NotesPayload['why_now']) },
  { key: 'freetext_after_why_now', render: (v) => renderFreetext(v as NotesPayload['freetext_after_why_now']) },
  { key: 'who_to_reach_out_to', render: (v) => renderContacts(v as NotesPayload['who_to_reach_out_to']) },
  { key: 'last_activities', render: (v) => renderLastActivities(v as NotesPayload['last_activities']) },
  { key: 'freetext_after_contacts', render: (v) => renderFreetext(v as NotesPayload['freetext_after_contacts']) },
  { key: 'freetext_before_next_steps', render: (v) => renderFreetext(v as NotesPayload['freetext_before_next_steps']) },
  { key: 'next_steps', render: (v) => renderNextSteps(v as NotesPayload['next_steps']) },
];

export function render(payload: NotesPayload): string {
  const verdict = (payload.fit?.verdict ?? 'good fit').toLowerCase();
  const parts: string[] = [];

  for (const { key, render: renderFn } of SECTIONS) {
    const v = payload[key];
    if (isEmpty(v)) continue;

    let chunk: string;
    if (key === 'fit') {
      chunk = renderFit(v as FitData);
    } else if (renderFn) {
      chunk = renderFn(v, verdict);
    } else {
      continue;
    }

    parts.push(
      `<section style="width:100%;min-width:0;box-sizing:border-box;">${chunk}</section>`,
    );
  }

  return (
    INTERACTIVE_CSS +
    `<div style="width:440px;max-width:100%;box-sizing:border-box;font-family:${T.sans};` +
    `color:${T.fg};display:flex;flex-direction:column;gap:10px;">` +
    parts.join('') +
    `</div>`
  );
}
