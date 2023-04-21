import React from 'react';
import { render, fireEvent, screen, act } from '@testing-library/react';
import ExporterPostcode from '../pages/exporter-postcode';

jest.mock('next/router', () => ({
  useRouter: jest.fn(() => ({
    isReady: true,
    query: { id: '123' },
  })),
}));

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

    const submitButton = screen.getByText('Save and continue');
    fireEvent.click(submitButton);

    const errorHeading = screen.getByText('There is a problem');
    expect(errorHeading).toBeTruthy();
  });
});
