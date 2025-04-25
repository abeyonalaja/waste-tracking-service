import React from 'react';
import { render, fireEvent, screen, act } from 'jest-utils';
import CollectionDate from 'pages/incomplete/journey/collection-date';

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
      json: () => Promise.resolve({ status: 'NotStarted' }),
    }) as Promise<Response>,
);

describe('Collection date page', () => {
  it('should render the page', async () => {
    await act(async () => {
      render(<CollectionDate />);
    });
  });
  it('should show validation messages if none radio is selected', async () => {
    await act(async () => {
      render(<CollectionDate />);
    });

    const submitButton = screen.getByText('Save and continue');
    fireEvent.click(submitButton);

    const errorMessage = screen.getAllByText(
      'Select yes if you know when the waste will be collected',
    )[0];
    expect(errorMessage).toBeTruthy();
  });
  it('should show validation messages if Yes radio is selected and no date entered', async () => {
    await act(async () => {
      render(<CollectionDate />);
    });

    const yesRadio = screen.getByLabelText('Yes');
    fireEvent.click(yesRadio);

    const submitButton = screen.getByText('Save and continue');
    fireEvent.click(submitButton);

    const errorMessage = screen.getAllByText('Enter a real date')[0];
    expect(errorMessage).toBeTruthy();
  });

  it('should show validation messages if Yes radio is selected and date is in the past', async () => {
    await act(async () => {
      render(<CollectionDate />);
    });

    const yesRadio = screen.getByLabelText('Yes');
    fireEvent.click(yesRadio);

    const day = screen.getByLabelText('Day');
    const month = screen.getByLabelText('Month');
    const year = screen.getByLabelText('Year');

    fireEvent.change(day, { target: { value: '01' } });
    fireEvent.change(month, { target: { value: '01' } });
    fireEvent.change(year, { target: { value: '2023' } });

    const submitButton = screen.getByText('Save and continue');
    fireEvent.click(submitButton);

    const errorMessage = screen.getAllByText('Enter a date in the future')[0];
    expect(errorMessage).toBeTruthy();
  });
});
