// Build links that work locally and on GitHub Pages
export function url(path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return `${base}/${path.replace(/^\//, '')}`;
}

// "Football match" -> "football-match"
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export function year(date: string): string {
  return date.slice(0, 4);
}

export function decade(date: string): string {
  return `${date.slice(0, 3)}0s`;
}

const MONTHS = ['January', 'February', 'March', 'April', 'May',
  'June', 'July', 'August', 'September', 'October', 'November',
  'December'];

// "1952-09-13" -> "September 13, 1952"; "1944-10" -> "October 1944";
// "1955" + approximate -> "ca. 1955"
export function formatDate(date: string, approximate = false): string {
  const [y, m, d] = date.split('-')
  let text = y;
  if (m && d) text = `${MONTHS[Number(m) - 1]} ${Number(d)}, ${y}`;
  else if (m) text = `${MONTHS[Number(m) - 1]} ${y}`;
  return approximate ? `ca. ${text}` : text;
}