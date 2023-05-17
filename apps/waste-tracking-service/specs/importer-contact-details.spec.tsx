import React from 'react';
import { render, fireEvent, screen, act } from '@testing-library/react';
import ImporterContactDetails from '../pages/importer-contact-details';

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

describe('Importer contact details page', () => {
  it('should fetch the data when the component mounts', async () => {
    await act(async () => {
      render(<ImporterContactDetails />);
    });
  });

  it('should display a loading message while data is being fetched', async () => {
    global.fetch.mockImplementationOnce(
      () =>
        new Promise(() => {
          return;
        })
    );

    await act(async () => {
      render(<ImporterContactDetails />);
    });

    expect(screen.getByText('Loading')).toBeTruthy();
  });

  it('should display an error message if the data fetching fails', async () => {
    global.fetch.mockImplementationOnce(() => Promise.resolve({ ok: false }));

    await act(async () => {
      render(<ImporterContactDetails />);
    });

    expect(screen.getByText('No valid record found')).toBeTruthy();
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
});
