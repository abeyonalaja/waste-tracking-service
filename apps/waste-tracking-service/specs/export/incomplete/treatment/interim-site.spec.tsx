import React from 'react';
import { render, act, screen, fireEvent } from 'jest-utils';
import InterimSite from 'pages/export/incomplete/treatment/interim-site';

jest.mock('next/router', () => ({
  useRouter: jest.fn(() => ({
    isReady: true,
    query: { id: '123' },
  })),
}));

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () =>
      Promise.resolve({
        status: 'Started',
        values: [{ id: 'idofinterimsite' }],
      }),
  })
);

describe('Interim site pages', () => {
  it('should render the page', async () => {
    await act(async () => {
      render(<InterimSite />);
    });
  });
  it('should render view and show validation message if no content is entered', async () => {
    await act(async () => {
      render(<InterimSite />);
    });

    const submitButton = screen.getByText('Save and continue');
    fireEvent.click(submitButton);

    const errorMessage = screen.getAllByText(
      'Select yes if the waste will go to an interim site'
    )[0];
    expect(errorMessage).toBeTruthy();
  });
});
