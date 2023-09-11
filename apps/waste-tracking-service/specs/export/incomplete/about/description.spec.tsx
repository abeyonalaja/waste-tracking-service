import React from 'react';
import { render, fireEvent, screen, act } from 'jest-utils';
import Description from 'pages/export/incomplete/about/description';

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

  it('should show validation message if no content is entered', async () => {
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

  it('should show validation messages if content exceeds 100 characters', async () => {
    await act(async () => {
      render(<Description />);
    });

    const textareaElement = screen.getByLabelText('Describe the waste');
    fireEvent.change(textareaElement, {
      target: {
        value:
          'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
      },
    });

    const messageElement = screen.getByText('You have 1 character too many');
    expect(messageElement).toBeTruthy();

    const submitButton = screen.getByText('Save and continue');
    fireEvent.click(submitButton);

    const errorMessage = screen.getAllByText(
      'Description must be 100 characters or less'
    )[0];
    expect(errorMessage).toBeTruthy();
  });
});
