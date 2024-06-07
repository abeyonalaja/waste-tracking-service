import { format } from 'date-fns';

export const formatDate = (dateString: Date): string => {
  return format(new Date(dateString), 'd MMM yyyy');
};
