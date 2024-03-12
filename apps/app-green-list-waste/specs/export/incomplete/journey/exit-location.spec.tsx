import React from 'react';
import { render, fireEvent, screen, act } from 'jest-utils';
import ExitLocation from 'pages/export/incomplete/journey/exit-location';

jest.mock('next/router', () => ({
  useRouter: jest.fn(() => ({
    isReady: true,
    query: { id: '123' },
  })),
}));

jest.mock('next-auth/jwt', () => ({
  getToken: jest.fn(() => Promise.resolve({ id_token: 'dummytoken' })),
}));

global.fetch = jest.fn(
  () =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ wasteCode: { type: 'NotApplicable' } }),
    }) as Promise<Response>
);

describe('Point Of Exit page', () => {
  it('should fetch the data when the component mounts', async () => {
    await act(async () => {
      render(<ExitLocation />);
    });
  });

  it('should display a loading message while data is being fetched', async () => {
    (global.fetch as jest.Mock).mockImplementationOnce(
      () =>
        new Promise(() => {
          return;
        })
    );

    await act(async () => {
      render(<ExitLocation />);
    });

    expect(screen.findByText('Loading')).toBeTruthy();
  });

  it('should show validation message if no radio is selected', async () => {
    await act(async () => {
      render(<ExitLocation />);
    });

    const submitButton = screen.getByText('Save and continue');
    fireEvent.click(submitButton);

    const errorHeading = screen.getByText('There is a problem');
    expect(errorHeading).toBeTruthy();
  });

  it('should show validation message if selected YES and do not enter a location', async () => {
    await act(async () => {
      render(<ExitLocation />);
    });

    const yesRadioLabel = screen.getByLabelText('Yes');
    fireEvent.click(yesRadioLabel);

    const submitButton = screen.getByText('Save and continue');
    fireEvent.click(submitButton);

    const errorHeading = screen.getByText('There is a problem');
    expect(errorHeading).toBeTruthy();
  });
});
