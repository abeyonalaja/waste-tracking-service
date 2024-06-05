import '@testing-library/jest-dom';
import { render, act, screen, waitFor } from 'jest-utils';
import userEvent from '@testing-library/user-event';
import Cancel from '../../../pages/multiples/[id]/submit/cancel';
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

jest.mock('next/router', () => {
  const router = {
    back: jest.fn(),
    push: jest.fn(),
    pathname: '/',
    route: '',
    asPath: '',
    query: {},
    events: {
      on: jest.fn(),
      off: jest.fn(),
      emit: jest.fn(),
    },
  };
  return {
    useRouter: jest.fn().mockReturnValue(router),
  };
});

describe('Cancel Submission page', () => {
  it('Renders without errors while submission data', async () => {
    await act(async () => {
      render(<Cancel />);
    });
  });

  it('Redirects user back to multiples page when cancel button is clicked', async () => {
    await act(async () => {
      render(<Cancel />);
    });

    const button = screen.getByRole('button', { name: 'Confirm and cancel' });
    await act(async () => {
      await userEvent.click(button);
    });

    await waitFor(() => expect(useRouter().push).toHaveBeenCalled());
  });

  it('Navigates the user back when bread crumbs back button is clicked', async () => {
    await act(async () => {
      render(<Cancel />);
    });

    const link = screen.getByRole('link', { name: 'Back' });
    await act(async () => {
      await userEvent.click(link);
    });

    await waitFor(() => expect(useRouter().back).toHaveBeenCalled());
  });

  it('Navigates the user back when Continue to submit records button is clicked', async () => {
    await act(async () => {
      render(<Cancel />);
    });

    const button = screen.getByRole('button', {
      name: 'Continue to submit records',
    });
    await act(async () => {
      await userEvent.click(button);
    });

    await waitFor(() => expect(useRouter().back).toHaveBeenCalled());
  });
});
