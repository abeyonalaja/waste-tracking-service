export function formatColumnName(columnName: string): string {
  return columnName.replace(/\s/g, '-').toLowerCase();
}
