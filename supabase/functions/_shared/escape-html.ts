/**
 * HTML-escape a string for safe inclusion in email bodies or HTML responses.
 * Escapes &, <, >, ", and ' (single quote important for attribute values).
 */
export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
