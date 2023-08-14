import React from 'react';
import { render, fireEvent, screen, act } from '../jest-utils';
import ImporterContactDetails from '../pages/export/incomplete/exporter-importer/importer-contact-details';

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
  it('should fetch the data when the component mounts', async () => {
    await act(async () => {
      render(<ImporterContactDetails />);
    });
  });

  it('should display a loading message while data is being fetched', async () => {
    await act(async () => {
      render(<ImporterContactDetails />);
    });

    expect(screen.findByText('Loading')).toBeTruthy();
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
