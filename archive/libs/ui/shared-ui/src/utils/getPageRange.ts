export function getPageRange(
  currentPage: number,
  totalPages: number,
): (string | number)[] {
  const range: Array<string | number> = [];
  const maxPagesToShow = 5;
  const totalPagesInRange = Math.min(totalPages, maxPagesToShow);

  if (totalPages <= maxPagesToShow) {
    for (let i = 1; i <= totalPages; i++) {
      range.push(i);
    }
  } else if (currentPage < maxPagesToShow) {
    for (let i = 1; i <= totalPagesInRange; i++) {
      range.push(i);
    }
    range.push('...');
    range.push(totalPages);
  } else if (currentPage >= totalPages - 2) {
    range.push(1);
    range.push('...');
    for (let i = totalPages - totalPagesInRange + 1; i <= totalPages; i++) {
      range.push(i);
    }
  } else {
    range.push(1);
    range.push('...');
    for (let i = currentPage - 1; i <= currentPage + 1; i++) {
      range.push(i);
    }
    range.push('...');
    range.push(totalPages);
  }

  return range;
}
