import type { ReactNode } from 'react';

export function slugify(
  value: string | ReactNode | number | null | undefined,
): string {
  if (!value) return '';
  return value
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
