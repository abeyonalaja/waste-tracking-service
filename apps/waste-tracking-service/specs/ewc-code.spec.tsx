import React from 'react';
import { render, fireEvent, screen, act } from '../jest-utils';
import EwcAddOptional from '../pages/export/incomplete/about/ewc';

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
    json: () => Promise.resolve({ ewcCodes: [1, 2] }),
  })
);

describe('EWC Code component', () => {
  it('should render the component', async () => {
    await act(async () => {
      render(<EwcAddOptional />);
    });
  });

  it('displays a validation message when no radio is selected', async () => {
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({ ok: true, json: () => Promise.resolve({ data: {} }) })
    );

    await act(async () => {
      render(<EwcAddOptional />);
    });

    const submitButton = screen.getByText('Save and continue');
    fireEvent.click(submitButton);

    const errorHeading = screen.findByText('There is a problem');
    expect(errorHeading).toBeTruthy();

    expect(
      screen.findByText('Select yes if you want to add an EWC code')
    ).toBeTruthy();
  });

  it('displays a validation message when the Yes radio is selected but no EWC code is selected', async () => {
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({ ok: true, json: () => Promise.resolve({ data: {} }) })
    );

    await act(async () => {
      render(<EwcAddOptional />);
    });

    const yesRadioLabel = screen.getByLabelText('Yes');
    fireEvent.click(yesRadioLabel);

    const submitButton = screen.getByText('Save and continue');
    fireEvent.click(submitButton);

    const errorHeading = screen.findByText('There is a problem');
    expect(errorHeading).toBeTruthy();

    expect(screen.findByText('Select an EWC code')).toBeTruthy();
  });
});
