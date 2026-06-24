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

  const body =
    `<div style="width:100%;max-width:100%;box-sizing:border-box;font-family:${T.sans};` +
    `color:${T.fg};display:flex;flex-direction:column;gap:10px;">` +
    parts.join('') +
    `</div>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{width:100%;height:100%}
body{width:100%;min-height:100%;padding:16px;background:#f9fafb;overflow-y:auto}
#gokit-badge{position:fixed;top:10px;right:10px;z-index:9999;display:inline-flex;align-items:center;gap:5px;padding:3px 8px 3px 6px;background:${T.violet_dark};color:#fff;font-family:${T.mono};font-size:10px;font-weight:600;letter-spacing:.04em;border-radius:${T.r_pill};box-shadow:0 1px 4px rgba(0,0,0,.25);user-select:none;opacity:.85}
#gokit-badge svg{flex-shrink:0}
${INTERACTIVE_CSS}
</style>
</head>
<body>
<div id="gokit-badge"><svg width="10" height="10" viewBox="0 0 10 10" fill="none"><circle cx="5" cy="5" r="4.5" fill="#0fa894"/></svg>gokit</div>
${body}
<script>
(function(){
  var h=document.documentElement.scrollHeight;
  window.parent.postMessage({type:'ui-size-change',messageId:'sz-'+Date.now(),payload:{height:h}},'*');
})();
</script>
</body>
</html>`;
}
