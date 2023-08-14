import React from 'react';
import { render, act, screen, fireEvent } from '../jest-utils';
import RecoveryFacility from '../pages/export/incomplete/treatment/recovery-facility-details';

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
      Promise.resolve({ status: 'Started', values: [{ id: '987654321' }] }),
  })
);

describe('Recovery facilities pages', () => {
  it('should fetch the data when the page loads', async () => {
    await act(async () => {
      render(<RecoveryFacility />);
    });
  });

  it('should render address view and show validation message if no content is entered', async () => {
    await act(async () => {
      render(<RecoveryFacility />);
    });

    const addressField = screen.getByLabelText('Address');
    expect(addressField).toBeTruthy();

    const submitButton = screen.getByText('Save and continue');
    fireEvent.click(submitButton);

    const errorHeading = screen.getByText('There is a problem');
    expect(errorHeading).toBeTruthy();
  });
});
