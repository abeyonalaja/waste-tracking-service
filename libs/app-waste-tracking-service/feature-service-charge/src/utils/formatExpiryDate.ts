import { format } from 'date-fns';

export function formatExpiryDate(expiryDate: string): string {
  return format(new Date(expiryDate), 'EEEE do MMMM yyyy');
}
