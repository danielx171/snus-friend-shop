const ISO_DATE_ONLY_RE = /^\d{4}-\d{2}-\d{2}$/;

const DEFAULT_DISPLAY_DATE_OPTIONS: Intl.DateTimeFormatOptions = {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
};

export function formatDisplayDate(
  raw: string | Date,
  options: Intl.DateTimeFormatOptions = DEFAULT_DISPLAY_DATE_OPTIONS,
): string {
  const value = raw instanceof Date
    ? raw
    : new Date(ISO_DATE_ONLY_RE.test(raw) ? `${raw}T00:00:00` : raw);

  if (Number.isNaN(value.getTime())) {
    return String(raw);
  }

  return value.toLocaleDateString('en-GB', options);
}
