import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { formatDate } from 'utils/formatDate';

describe('DateConverter', () => {
  it('should display the formatted date', () => {
    const dateToTest = new Date('2023-07-30T20:31:17.127Z');
    const { getByText } = render(<>{formatDate(dateToTest)}</>);

    const expectedFormattedDate = '30 Jul 2023';
    expect(getByText(expectedFormattedDate)).toBeInTheDocument();
  });
});
