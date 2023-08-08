import React from 'react';
import { format } from 'date-fns';

export const DateConverter = ({ dateString }) => {
  const formattedDate = format(new Date(dateString), 'd MMM yyyy');

  return <div>{formattedDate}</div>;
};
