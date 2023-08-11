import React from 'react';
import { render, fireEvent, screen, act } from '../jest-utils';
import ImporterDetails from '../pages/export/importer-details';

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

describe('Importer details page', () => {
  it('should fetch the data when the component mounts', async () => {
    await act(async () => {
      render(<ImporterDetails />);
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
      render(<ImporterDetails />);
    });

    expect(screen.findByText('Loading')).toBeTruthy();
  });

  it('should show validation message if nothing entered', async () => {
    await act(async () => {
      render(<ImporterDetails />);
    });

    const submitButton = screen.getByText('Save and continue');
    fireEvent.click(submitButton);

    const errorHeading = screen.getByText('There is a problem');
    expect(errorHeading).toBeTruthy();
  });
});
