import React from 'react';
import { render, fireEvent, screen, act } from '../jest-utils';
import ExporterPostcode from '../pages/export/incomplete/exporter-importer/exporter-postcode';

jest.mock('next/router', () => ({
  useRouter: jest.fn(() => ({
    isReady: true,
    query: { id: '123' },
  })),
}));

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ data: {} }),
  })
);

describe('Exporter postcode page', () => {
  it('should render the page', async () => {
    await act(async () => {
      render(<ExporterPostcode />);
    });
  });

  it('should show validation message if no content is entered', async () => {
    await act(async () => {
      render(<ExporterPostcode />);
    });

    const submitButton = screen.getByText('Find address');
    fireEvent.click(submitButton);

    const errorHeading = screen.getByText('There is a problem');
    expect(errorHeading).toBeTruthy();
  });
});
