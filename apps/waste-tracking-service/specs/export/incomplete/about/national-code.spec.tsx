import React from 'react';
import { render, fireEvent, screen, act } from 'jest-utils';
import NationalCode from 'pages/export/incomplete/about/national-code';

jest.mock('next/router', () => ({
  useRouter: jest.fn(() => ({
    isReady: true,
    query: { id: '123' },
  })),
}));

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ wasteCode: { type: 'NotApplicable' } }),
  })
);

describe('National code page', () => {
  it('should render the page', async () => {
    await act(async () => {
      render(<NationalCode />);
    });
  });

  it('should show validation message if selected YES and do not enter a National code', async () => {
    await act(async () => {
      render(<NationalCode />);
    });

    const yesRadioLabel = screen.getByLabelText('Yes');
    fireEvent.click(yesRadioLabel);

    const submitButton = screen.getByText('Save and continue');
    fireEvent.click(submitButton);

    const errorHeading = screen.getByText('There is a problem');
    expect(errorHeading).toBeTruthy();
  });

  it('should show validation message if selected YES and enter non-alphanumeric characters', async () => {
    await act(async () => {
      render(<NationalCode />);
    });

    const yesRadioLabel = screen.getByLabelText('Yes');
    fireEvent.click(yesRadioLabel);

    const nationalCode = screen.getByLabelText('Enter code');
    fireEvent.change(nationalCode, { target: { value: 'code£2q3_' } });

    const submitButton = screen.getByText('Save and continue');
    fireEvent.click(submitButton);

    const errorMessage = screen.getAllByText(
      'The code must only include letters a to z, numbers, spaces, hyphens and back slashes'
    )[0];
    expect(errorMessage).toBeTruthy();
  });
});
