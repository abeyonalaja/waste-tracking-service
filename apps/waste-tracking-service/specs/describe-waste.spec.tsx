import React from 'react';
import { render, fireEvent, screen, act } from '../jest-utils';
import Description from '../pages/export/incomplete/about/description';

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

describe('Describe the waste page', () => {
  it('should render the page', async () => {
    await act(async () => {
      render(<Description />);
    });
    expect(screen.findByText('Describe the waste')).toBeTruthy();
  });

  it('should display a loading message while data is being fetched', async () => {
    global.fetch.mockImplementationOnce(
      () =>
        new Promise(() => {
          return;
        })
    );

    await act(async () => {
      render(<Description />);
    });
    expect(screen.findByText('Describe the waste')).toBeTruthy();
    expect(screen.findByText('Loading')).toBeTruthy();
  });

  it('should display an error message if the data fetching fails', async () => {
    global.fetch.mockImplementationOnce(() => Promise.resolve({ ok: false }));

    await act(async () => {
      render(<Description />);
    });

    expect(
      screen.findByText('The export record has not been found')
    ).toBeTruthy();
  });

  it('should show validation message if no content is entered', async () => {
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({ ok: true, json: () => Promise.resolve({ data: {} }) })
    );

    await act(async () => {
      render(<Description />);
    });

    const textareaElement = screen.getByLabelText('Describe the waste');
    fireEvent.change(textareaElement, { target: { value: null } });

    const messageElement = screen.getByText(
      'You have 100 characters remaining'
    );
    expect(messageElement).toBeTruthy();

    const submitButton = screen.getByText('Save and continue');
    fireEvent.click(submitButton);

    const errorHeading = screen.getByText('There is a problem');
    expect(errorHeading).toBeTruthy();
  });
});
