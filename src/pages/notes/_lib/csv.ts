/**
 * CSV export for the AI log (FE-5 §6).
 *
 * "What did you send where, and when" is a question a firm may have to answer
 * to a client or a regulator, and the answer has to leave the browser as a file
 * somebody can attach to an email. A table you can only scroll is not an answer.
 */

/**
 * RFC 4180 quoting. The interesting case is not commas — it is a rejection
 * reason someone typed a newline into, which without quoting shifts every
 * following column by one and silently corrupts the export.
 */
function cell(value: unknown): string {
  if (value === null || value === undefined) return '';
  const text = String(value);
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

export function toCsv(headers: string[], rows: Array<Array<unknown>>): string {
  return [headers.map(cell).join(','), ...rows.map((row) => row.map(cell).join(','))].join('\r\n');
}

/**
 * Prepending a BOM so Excel opens UTF-8 correctly. Without it, a German note
 * title in the export renders as mojibake on the machines most likely to open
 * this file, which makes the audit trail look untrustworthy for a reason that
 * has nothing to do with the audit trail.
 */
export function downloadCsv(filename: string, csv: string): void {
  const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
