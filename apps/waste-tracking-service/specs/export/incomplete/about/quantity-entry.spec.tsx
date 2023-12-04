import React from 'react';
import { render, fireEvent, screen, act } from 'jest-utils';
import QuantityEntry from 'pages/export/incomplete/about/quantity-entry';

jest.mock('next/router', () => ({
  useRouter: jest.fn(() => ({
    isReady: true,
    query: { id: '123' },
  })),
}));

jest.mock('next-auth/jwt', () => ({
  getToken: jest.fn(() => Promise.resolve({ id_token: 'dummytoken' })),
}));

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () =>
      Promise.resolve({
        id: '123',
        reference: '123',
        wasteDescription: {
          status: 'Started',
          wasteCode: {
            type: 'NotApplicable',
          },
        },
        wasteQuantity: {
          status: 'Started',
          value: {
            type: 'ActualData',
          },
        },
        exporterDetail: {
          status: 'NotStarted',
        },
        importerDetail: {
          status: 'NotStarted',
        },
        collectionDate: {
          status: 'NotStarted',
        },
        carriers: {
          status: 'NotStarted',
          transport: false,
        },
        collectionDetail: {
          status: 'NotStarted',
        },
        ukExitLocation: {
          status: 'NotStarted',
        },
        transitCountries: {
          status: 'NotStarted',
        },
        recoveryFacilityDetail: {
          status: 'NotStarted',
        },
        submissionConfirmation: {
          status: 'CannotStart',
        },
        submissionDeclaration: {
          status: 'CannotStart',
        },
        submissionState: {
          status: 'InProgress',
          timestamp: '2023-08-31T15:40:09.165Z',
        },
      }),
  })
);

describe('Quantity entry page', () => {
  it('should render the page', async () => {
    await act(async () => {
      render(<QuantityEntry />);
    });
  });

  it('should show validation message no weight entered (small waste)', async () => {
    await act(async () => {
      render(<QuantityEntry />);
    });

    const submitButton = screen.getByText('Save and continue');
    fireEvent.click(submitButton);

    const errorHeading = screen.getByText('There is a problem');
    expect(errorHeading).toBeTruthy();
  });

  it('should show validation message if weight over 25kg (small waste)', async () => {
    await act(async () => {
      render(<QuantityEntry />);
    });

    const weight = screen.getByLabelText('Weight in kilograms');
    fireEvent.change(weight, { target: { value: '26' } });

    const submitButton = screen.getByText('Save and continue');
    fireEvent.click(submitButton);

    const errorMessage = screen.getAllByText('Enter a weight 25kg or under')[0];
    expect(errorMessage).toBeTruthy();
  });
});
