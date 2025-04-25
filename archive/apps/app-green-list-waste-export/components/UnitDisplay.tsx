import React from 'react';

export const UnitDisplay = ({ type, quantityType }): React.ReactNode => {
  let unit = '';

  if (type === 'NotApplicable' && quantityType === 'Weight') {
    unit = 'kg';
  } else if (type !== 'NotApplicable' && quantityType === 'Weight') {
    unit = 'tonnes';
  } else if (type !== 'NotApplicable' && quantityType === 'Volume') {
    unit = 'm3';
  }

  return <span> {unit} </span>;
};
