import React from 'react';
import {
  render,
  fireEvent,
  waitFor,
  screen,
  act,
} from '@testing-library/react';
import EwcCode from '../pages/dashboard/ewc-code';

jest.mock('next/router', () => ({
  useRouter: jest.fn(() => ({
    isReady: true,
    query: { id: '123' },
  })),
}));

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ ewcCodes: [1, 2] }),
  })
);

describe('EWC Code component', () => {
  it('should render the component', async () => {
    await act(async () => {
      render(<EwcCode />);
    });
  });

  it('displays a validation message when no radio is selected', async () => {
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({ ok: true, json: () => Promise.resolve({ data: {} }) })
    );

    await act(async () => {
      render(<EwcCode />);
    });

    const submitButton = screen.getByText('Save and continue');
    fireEvent.click(submitButton);

    const errorHeading = screen.getByText('There is a problem');
    expect(errorHeading).toBeTruthy();

    expect(
      screen.getAllByText('Select yes if you want to add an EWC code')[0]
    ).toBeTruthy();
  });

  it('displays a validation message when the Yes radio is selected but no EWC code is selected', async () => {
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({ ok: true, json: () => Promise.resolve({ data: {} }) })
    );

    await act(async () => {
      render(<EwcCode />);
    });

    const yesRadioLabel = screen.getByLabelText('Yes');
    fireEvent.click(yesRadioLabel);

    const submitButton = screen.getByText('Save and continue');
    fireEvent.click(submitButton);

    const errorHeading = screen.getByText('There is a problem');
    expect(errorHeading).toBeTruthy();

    expect(screen.getAllByText('Select an EWC code')[0]).toBeTruthy();
  });
});
