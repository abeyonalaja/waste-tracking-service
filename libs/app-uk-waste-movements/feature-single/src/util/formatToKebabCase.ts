export function formatToKebabCase(columnName: string): string {
  return columnName.replace(/\s/g, '-').toLowerCase();
}
