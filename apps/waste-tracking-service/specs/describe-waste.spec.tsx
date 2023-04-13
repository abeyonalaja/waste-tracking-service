import React from 'react';
import { render, fireEvent, screen, act } from '@testing-library/react';
import DescribeWaste from '../pages/describe-waste';

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
  it('should fetch the data when the component mounts', async () => {
    await act(async () => {
      render(<DescribeWaste />);
    });
  });

  it('should display a loading message while data is being fetched', async () => {
    global.fetch.mockImplementationOnce(() => new Promise(() => { return }));

    await act(async () => {
      render(<DescribeWaste />);
    });

    expect(screen.getByText('Loading')).toBeTruthy();
  });

  it('should display an error message if the data fetching fails', async () => {
    global.fetch.mockImplementationOnce(() => Promise.resolve({ ok: false }));

    await act(async () => {
      render(<DescribeWaste />);
    });

    expect(screen.getByText('No valid record found')).toBeTruthy();
  });

  it('should show validation message if no content is entered', async () => {
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({ ok: true, json: () => Promise.resolve({ data: {} }) })
    );

    await act(async () => {
      render(<DescribeWaste />);
    });

    const textareaElement = screen.getByLabelText('Describe the waste');
    fireEvent.change(textareaElement, { target: { value: null } });

    const messageElement = screen.getByText('You have 100 character remaining');
    expect(messageElement).toBeTruthy();

    const submitButton = screen.getByText('Save and continue');
    fireEvent.click(submitButton);

    const errorHeading = screen.getByText('There is a problem');
    expect(errorHeading).toBeTruthy();
  });
});
