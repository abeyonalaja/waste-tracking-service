import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, act, waitFor } from 'jest-utils';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import userEvent from '@testing-library/user-event';
import Feedback from 'pages/feedback';
import { useRouter } from 'next/router';

global.fetch = jest.fn(
  () =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ status: 'NotStarted' }),
    }) as Promise<Response>,
);

jest.mock('next-auth/jwt', () => ({
  getToken: jest.fn(() => Promise.resolve({ id_token: 'dummytoken' })),
}));

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

const mockUseRouter = useRouter as jest.Mock;

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
    mockUseRouter.mockReturnValue({ query: { success: undefined } });

    await act(async () => {
      render(<TestFeedbackPage />);
    });
  });

  it('Has a submit button with the correct text', async () => {
    mockUseRouter.mockReturnValue({ query: { success: undefined } });

    await act(async () => {
      render(<TestFeedbackPage />);
    });
    const button = screen.getByRole('button', { name: 'Send feedback' });
    expect(button).toBeInTheDocument();
  });

  it('Displays success banner when user has submitted rating feedback', async () => {
    mockUseRouter.mockReturnValue({
      query: { success: undefined },
      replace: jest.fn(),
    });

    await act(async () => {
      render(<TestFeedbackPage />);
    });
    const button = screen.getByRole('radio', { name: 'Very satisfied' });
    await userEvent.click(button);

    waitFor(() => {
      const successMessage = screen.getByText(
        'You have submitted your feedback',
      );
      expect(successMessage).toBeInTheDocument();
    });
  });

  it('Displays success message on blank form submission', async () => {
    mockUseRouter.mockReturnValue({
      query: { success: undefined },
      replace: jest.fn(),
    });

    await act(async () => {
      render(<TestFeedbackPage />);
    });
    const button = screen.getByRole('button', { name: 'Send feedback' });
    await userEvent.click(button);

    waitFor(() => {
      const successMessage = screen.getByText(
        'You have submitted your feedback',
      );
      expect(successMessage).toBeInTheDocument();
    });
  });
});
