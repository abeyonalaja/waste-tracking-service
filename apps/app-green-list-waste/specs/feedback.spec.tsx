import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, act, waitFor } from 'jest-utils';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import userEvent from '@testing-library/user-event';
import Feedback from 'pages/export/feedback';

jest.mock('next-auth/jwt', () => ({
  getToken: jest.fn(() => Promise.resolve({ id_token: 'dummytoken' })),
}));

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

global.fetch = jest.fn(
  () =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ status: 'NotStarted' }),
    }) as Promise<Response>
);

function TestFeedbackPage() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <Feedback />;
    </QueryClientProvider>
  );
}
describe('Feedback page', () => {
  it('Should render the page', async () => {
    await act(async () => {
      render(<TestFeedbackPage />);
    });
  });

  it('Has a submit button with the correct text', async () => {
    await act(async () => {
      render(<TestFeedbackPage />);
    });
    const button = screen.getByRole('button', { name: 'Send feedback' });
    expect(button).toBeInTheDocument();
  });

  it('Displays success message on blank form submission', async () => {
    await act(async () => {
      render(<TestFeedbackPage />);
    });
    const button = screen.getByRole('button', { name: 'Send feedback' });
    await userEvent.click(button);

    waitFor(() => {
      const successMessage = screen.getByText(
        'You have submitted your feedback'
      );
      expect(successMessage).toBeInTheDocument();
    });
  });
});
