import { formatExpiryDate } from './formatExpiryDate';

describe('format expiry date function', () => {
  it('formats the date correctly', () => {
    const inputDate = '2024-09-01';

    const result = formatExpiryDate(inputDate);
    expect(result).toEqual('Sunday 1st September 2024');
  });
});
