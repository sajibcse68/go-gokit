export function esc(s: unknown): string {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

export function mdBold(s: string): string {
  return (s || '')
    .split(/\*\*(.+?)\*\*/)
    .map((p, i) => (i % 2 ? `<strong>${esc(p)}</strong>` : esc(p)))
    .join('');
}

export function paragraphs(s: string): string {
  return (s || '')
    .trim()
    .split('\n\n')
    .filter((p) => p.trim())
    .map((p) => `<p style="margin:0;">${mdBold(p.trim())}</p>`)
    .join('');
}

export function fmtDate(s: string): string {
  try {
    const [year, month, day] = s.split('-').map(Number);
    const d = new Date(year, month - 1, day);
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
    ];
    return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
  } catch {
    return esc(s);
  }
}

export function getInitials(name: string): string {
  const parts = (name || '').split(' ').filter(Boolean);
  if (!parts.length) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function isEmpty(v: unknown): boolean {
  if (!v) return true;
  if (Array.isArray(v)) return v.length === 0;
  if (typeof v === 'object') return Object.keys(v as object).length === 0;
  return false;
}

export function stripPrefix(s: string, prefix: string): string {
  return s.startsWith(prefix + ':') ? s.split(':', 2)[1] : s;
}
