import React from 'react';
import { render, fireEvent, screen, act } from 'jest-utils';
import EwcCodes from 'pages/export/incomplete/about/ewc-code';

jest.mock('next/router', () => ({
  useRouter: jest.fn(() => ({
    isReady: true,
    query: { id: '123' },
  })),
}));

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ status: 'NotStarted' }),
  })
);

describe('EWC code page', () => {
  it('should display the page', async () => {
    await act(async () => {
      render(<EwcCodes />);
    });
  });

  it('should show validation message if no radio is selected', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ status: 'NotStarted' }),
      })
    );

    await act(async () => {
      render(<EwcCodes />);
    });

    const pageTitle = screen.getByText(
      'What is the first European Waste Catalogue (EWC) code?'
    );
    expect(pageTitle).toBeTruthy();

    const submitButton = screen.getByText('Save and continue');
    fireEvent.click(submitButton);

    const errorHeading = screen.getByText('There is a problem');
    expect(errorHeading).toBeTruthy();
  });

  it('should show validation message if no EWC code is entered', async () => {
    await act(async () => {
      render(<EwcCodes />);
    });

    const ewcCode = screen.getByLabelText('Enter code');
    fireEvent.click(ewcCode);

    const submitButton = screen.getByText('Save and continue');
    fireEvent.click(submitButton);

    const errorHeading = screen.getByText('There is a problem');
    expect(errorHeading).toBeTruthy();
  });

  it('should show validation message if only 4 chars entered for EWC code', async () => {
    await act(async () => {
      render(<EwcCodes />);
    });

    const ewcCode = screen.getByLabelText('Enter code');
    fireEvent.change(ewcCode, { target: { value: '0101' } });

    const submitButton = screen.getByText('Save and continue');
    fireEvent.click(submitButton);

    const errorHeading = screen.getByText('There is a problem');
    expect(errorHeading).toBeTruthy();
  });

  it('should show list page if EWC codes are returned from the API', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            status: 'Started',
            ewcCodes: [
              {
                code: '010101',
                description: 'wastes from mineral metalliferous excavation',
              },
            ],
          }),
      })
    );

    await act(async () => {
      render(<EwcCodes />);
    });

    const country = screen.getByText('01 01 01');
    expect(country).toBeTruthy();

    const pageTitle = screen.getByText(
      'You have added 1 European Waste Catalogue (EWC) code'
    );
    expect(pageTitle).toBeTruthy();
  });

  it('should show validation message if selected YES to additional EWC code and do not enter a code', async () => {
    await act(async () => {
      render(<EwcCodes />);
    });

    const yesRadio = screen.getByLabelText('Yes');
    fireEvent.click(yesRadio);

    const submitButton = screen.getByText('Save and continue');
    fireEvent.click(submitButton);

    const errorHeading = screen.getByText('There is a problem');
    expect(errorHeading).toBeTruthy();
  });

  it('should show confirm view when remove link is clicked', async () => {
    await act(async () => {
      render(<EwcCodes />);
    });

    const removeLink = screen.getByText('Remove');
    fireEvent.click(removeLink);

    const pageTitle = screen.getByText(
      'Are you sure you want to remove code: 01 01 01?'
    );
    expect(pageTitle).toBeTruthy();
  });
});
