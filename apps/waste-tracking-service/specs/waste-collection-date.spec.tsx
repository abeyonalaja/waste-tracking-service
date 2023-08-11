import React from 'react';
import { act, fireEvent, render, screen } from '../jest-utils';
import '@testing-library/jest-dom';
import WasteCollectionDate from '../pages/export/waste-collection-date';

jest.mock('next/router', () => ({
  useRouter: jest.fn(() => ({
    isReady: true,
    query: { id: '123' },
    push: jest.fn(),
  })),
}));

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ data: {} }),
  })
);

describe('Waste Collection Date page', () => {
  it('should display a loading message while data is being fetched', async () => {
    global.fetch.mockImplementationOnce(
      () =>
        new Promise(() => {
          return;
        })
    );

    await act(async () => {
      render(<WasteCollectionDate />);
    });

    expect(screen.findByText('Loading')).toBeTruthy();
  });

  it('displays a validation message when no option is selected', async () => {
    await act(async () => {
      render(<WasteCollectionDate />);
    });
    const submitButton = screen.getByText('Save and continue');
    fireEvent.click(submitButton);

    const errorHeading = screen.getByText('There is a problem');
    expect(errorHeading).toBeTruthy();
  });

  it('displays a validation message when Actual Date selected and no date entered', async () => {
    await act(async () => {
      render(<WasteCollectionDate />);
    });

    const actualRadioLabel = screen.getByLabelText(
      'Yes, I’ll enter the actual date'
    );
    fireEvent.click(actualRadioLabel);

    const submitButton = screen.getByText('Save and continue');
    fireEvent.click(submitButton);

    const errorHeading = screen.getAllByText('Enter a real date');
    expect(errorHeading).toBeTruthy();
  });

  it('displays a validation message when Actual Date selected and past date entered', async () => {
    await act(async () => {
      render(<WasteCollectionDate />);
    });

    const actualRadioLabel = screen.getByLabelText(
      'Yes, I’ll enter the actual date'
    );
    fireEvent.click(actualRadioLabel);

    const day = screen.getByLabelText('Day');
    fireEvent.change(day, { target: { value: 14 } });
    const month = screen.getByLabelText('Month');
    fireEvent.change(month, { target: { value: 5 } });
    const year = screen.getByLabelText('Year');
    fireEvent.change(year, { target: { value: 2023 } });

    const submitButton = screen.getByText('Save and continue');
    fireEvent.click(submitButton);

    const errorHeading = screen.getAllByText('Enter a date in the future');
    expect(errorHeading).toBeTruthy();
  });
});
