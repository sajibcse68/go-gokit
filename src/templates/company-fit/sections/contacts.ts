import { T } from '../tokens.js';
import { esc, mdBold, getInitials, stripPrefix } from '../utils.js';
import { sectionHead, iconBtn } from '../shared.js';
import { MAIL_SVG, PHONE_SVG, LI_SVG } from '../icons.js';
import type { Contact } from '../types.js';

const AVATAR_PALETTE = [T.green, T.violet, T.ink, T.gray_70];

function contactActions(c: Contact): string {
  const mail = c.email ? stripPrefix(c.email, 'mailto') : '';
  const ph = c.phone ? stripPrefix(c.phone, 'tel') : '';
  const phDigits = ph.replace(/[^+0-9]/g, '');
  const li = c.linkedin ?? '';

  return (
    iconBtn(`mailto:${mail}`, T.link, MAIL_SVG, mail ? 'Email' : 'No email on file', !mail) +
    iconBtn(`tel:${phDigits}`, T.green_dark, PHONE_SVG, ph ? 'Phone' : 'No phone on file', !ph) +
    iconBtn(li, '#0a66c2', LI_SVG, li ? 'LinkedIn' : 'No LinkedIn on file', !li)
  );
}

function contactDetail(label: string, valueHtml: string): string {
  return (
    `<div style="font-size:11px;font-weight:700;letter-spacing:.06em;` +
    `text-transform:uppercase;color:${T.fg_muted};">${label}</div>` +
    `<div style="font-size:14px;line-height:1.5;color:${T.fg};word-break:break-word;">${valueHtml}</div>`
  );
}

function contactExpandable(c: Contact): string {
  const mail = c.email ? stripPrefix(c.email, 'mailto') : '';
  const ph = c.phone ? stripPrefix(c.phone, 'tel') : '';
  const li = c.linkedin ?? '';

  const notOnFile = `<span style="color:${T.fg_muted};font-style:italic;">Not on file</span>`;
  const kvRows = [
    contactDetail(
      'Email',
      mail
        ? `<a href="mailto:${esc(mail)}" style="color:${T.link};text-decoration:none;">${esc(mail)}</a>`
        : notOnFile,
    ),
    contactDetail('Phone', ph ? esc(ph) : notOnFile),
    contactDetail(
      'LinkedIn',
      li
        ? `<a href="${esc(li)}" target="_blank" rel="noopener" style="color:${T.link};text-decoration:none;">${esc(li)}</a>`
        : notOnFile,
    ),
    ...(c.role ? [contactDetail('Role', mdBold(c.role))] : []),
    ...(c.best_angle ? [contactDetail('Best angle', mdBold(c.best_angle))] : []),
  ];

  const chev =
    `<span data-chev style="width:8px;height:8px;border-right:1.5px solid ${T.fg_muted};` +
    `border-bottom:1.5px solid ${T.fg_muted};transform:rotate(45deg) translate(-2px,-2px);"></span>`;

  return (
    `<details style="display:flex;flex-direction:column;">` +
    `<summary style="order:2;list-style:none;cursor:pointer;padding:10px 14px;` +
    `display:flex;align-items:center;justify-content:space-between;` +
    `font-family:${T.mono};font-size:11px;font-weight:700;letter-spacing:.06em;` +
    `text-transform:uppercase;color:${T.fg_muted};background:${T.gray_5};` +
    `border-top:1px solid ${T.border};outline:none;">` +
    `<span data-closed>Show contact details</span>` +
    `<span data-open style="display:none;">Hide contact details</span>` +
    `${chev}</summary>` +
    `<div style="order:1;padding:14px;display:grid;grid-template-columns:auto 1fr;` +
    `gap:8px 16px;align-items:baseline;">${kvRows.join('')}</div>` +
    `</details>`
  );
}

function contactCard(c: Contact, index: number): string {
  const nm = c.name ?? '';
  const init = c.name_initials ?? getInitials(nm);
  const avBg = AVATAR_PALETTE[index % AVATAR_PALETTE.length];

  return (
    `<div style="background:${T.white};border:1px solid ${T.border};` +
    `border-radius:${T.r_md};overflow:hidden;">` +
    `<div style="display:grid;grid-template-columns:40px 1fr auto;gap:12px;` +
    `align-items:center;padding:14px;">` +
    `<div style="width:40px;height:40px;border-radius:50%;background:${avBg};` +
    `color:${T.white};display:flex;align-items:center;justify-content:center;` +
    `font-weight:700;font-size:14px;">${esc(init)}</div>` +
    `<div>` +
    `<div style="font-size:15px;line-height:1.3;font-weight:700;color:${T.fg};">${esc(nm)}</div>` +
    `<div style="font-size:14px;line-height:1.5;color:${T.fg_muted};">${mdBold(c.role ?? '')}</div>` +
    `</div>` +
    `<div style="display:flex;gap:6px;">${contactActions(c)}</div>` +
    `</div>${contactExpandable(c)}</div>`
  );
}

export function renderContacts(items: Contact[] | undefined): string {
  if (!items?.length) return '';
  const count = `${items.length} contact${items.length === 1 ? '' : 's'}`;
  return (
    sectionHead('Who to reach out to', count) +
    `<div style="display:flex;flex-direction:column;gap:12px;">` +
    `${items.map((c, i) => contactCard(c, i)).join('')}</div>`
  );
}
