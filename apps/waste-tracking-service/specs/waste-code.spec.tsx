import React from 'react';
import { act, render } from '../jest-utils';
import WasteCode from '../pages/export/waste-code';

jest.mock('next/router', () => ({
  useRouter: jest.fn(() => ({ query: {} })),
}));

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ data: {} }),
  })
);

describe('Waste code page', () => {
  it('should fetch the data when the page loads', async () => {
    await act(async () => {
      render(<WasteCode />);
    });
  });
});
