import React from 'react';
import { render, fireEvent, screen, act } from 'jest-utils';
import ImporterContactDetails from 'pages/export/incomplete/exporter-importer/importer-contact-details';

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
        data: {},
      }),
  })
);

describe('Importer contact details page', () => {
  it('should render the page', async () => {
    await act(async () => {
      render(<ImporterContactDetails />);
    });
  });

  it('should show validation message if nothing entered', async () => {
    await act(async () => {
      render(<ImporterContactDetails />);
    });

    const submitButton = screen.getByText('Save and continue');
    fireEvent.click(submitButton);

    const errorHeading = screen.getByText('There is a problem');
    expect(errorHeading).toBeTruthy();
  });

  it('should show validation message if invalid email address entered', async () => {
    await act(async () => {
      render(<ImporterContactDetails />);
    });

    const reference = screen.getByLabelText('Email address');
    fireEvent.change(reference, { target: { value: 'email@domain' } });

    const submitButton = screen.getByText('Save and continue');
    fireEvent.click(submitButton);

    const errorMessage = screen.getAllByText('Enter a real email address')[0];
    expect(errorMessage).toBeTruthy();
  });

  it('should show validation message if invalid telephone number entered', async () => {
    await act(async () => {
      render(<ImporterContactDetails />);
    });

    const reference = screen.getByLabelText(
      'Phone numberFor international numbers include the country code'
    );
    fireEvent.change(reference, { target: { value: '07777222' } });

    const submitButton = screen.getByText('Save and continue');
    fireEvent.click(submitButton);

    const errorMessage = screen.getAllByText('Enter a real phone number')[0];
    expect(errorMessage).toBeTruthy();
  });
});
