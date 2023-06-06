import React from 'react';

export const WasteCarrierHeading = ({ index, noOfCarriers }) => {
  let itemName;

  if (noOfCarriers === 1) {
    itemName = 'Waste carrier';
  } else if (noOfCarriers > 1) {
    if (index === 0) {
      itemName = 'First waste carrier';
    } else if (index === 1) {
      itemName = 'Second waste carrier';
    } else if (index === 2) {
      itemName = 'Third waste carrier';
    } else if (index === 3) {
      itemName = 'Fourth waste carrier';
    } else if (index === 4) {
      itemName = 'Fifth waste carrier';
    }
  }

  return <div>{itemName}</div>;
};
