import React from 'react';
import { render, act } from '@testing-library/react';
import InterimSiteDetails from '../pages/interim-site-details';

jest.mock('next/router', () => ({
  useRouter: jest.fn(() => ({
    isReady: true,
    query: { id: '123' },
  })),
}));

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve(),
  })
);

describe('Interim site pages', () => {
  it('should fetch the data when the page loads', async () => {
    await act(async () => {
      render(<InterimSiteDetails />);
    });
  });
});
