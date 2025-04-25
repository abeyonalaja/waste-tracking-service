import '@testing-library/jest-dom';
import { formatDate } from 'utils/formatDate';

describe('DateConverter', () => {
  it('should display the formatted date', () => {
    const dateToTest = new Date('2023-07-30T20:31:17.127Z');

    const formattedDate = formatDate(dateToTest);

    expect(formattedDate).toEqual('30 Jul 2023');
  });
});
