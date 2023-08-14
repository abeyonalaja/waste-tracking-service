import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { DateConverter } from 'components';

describe('DateConverter', () => {
  it('should display the formatted date', () => {
    const dateStr = '2023-07-30T20:31:17.127Z';
    const { getByText } = render(<DateConverter dateString={dateStr} />);

    const expectedFormattedDate = '30 Jul 2023';
    expect(getByText(expectedFormattedDate)).toBeInTheDocument();
  });
});
