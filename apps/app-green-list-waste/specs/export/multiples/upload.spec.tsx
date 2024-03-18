import '@testing-library/jest-dom';
import { render, screen, act } from 'jest-utils';
import { waitFor } from '@testing-library/react';
import * as ReactQuery from '@tanstack/react-query';
import Index from '../../../pages/multiples/[id]/submit/submitted';
import { useRouter } from 'next/router';

global.fetch = jest.fn(
  () =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ status: 'NotStarted' }),
    }) as Promise<Response>
);

jest.mock('next/router', () => {
  const router = {
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

jest.mock('@tanstack/react-query', () => {
  const originalModule = jest.requireActual('@tanstack/react-query');
  return {
    ...originalModule,
    useQuery: jest.fn(),
  };
});

const mockUseQuery = ReactQuery.useQuery as jest.Mock;

const singleSubmissionData = {
  data: {
    id: '383d48c3-86f1-4076-a2ae-7789a9f11ccb',
    state: {
      status: 'Submitted',
      timestamp: '2024-02-26T17:22:48.752Z',
      transactionId: '2402_9050B29B',
      submissions: [
        {
          id: '264245aa-ed83-4e14-be57-8e01131b826f',
          transactionNumber: 'transaction_number',
        },
      ],
    },
  },
};

const multipleSubmissionData = {
  data: {
    id: '383d48c3-86f1-4076-a2ae-7789a9f11ccb',
    state: {
      status: 'Submitted',
      timestamp: '2024-02-26T17:22:48.752Z',
      transactionId: '2402_9050B29B',
      submissions: new Array(100).fill({
        id: '264245aa-ed83-4e14-be57-8e01131b826f',
        transactionNumber: 'transaction_number',
      }),
    },
  },
};

describe('Submitted page', () => {
  it('Renders without errors', async () => {
    mockUseQuery.mockReturnValue({
      data: singleSubmissionData,
      isPending: false,
      error: false,
    });

    await act(async () => {
      render(<Index />);
    });
  });

  it('Renders a loader while submission data', async () => {
    mockUseQuery.mockReturnValue({
      data: undefined,
      isPending: true,
      error: false,
    });

    await act(async () => {
      render(<Index />);
    });

    await waitFor(() => {
      const loader = screen.getByTestId('multiples-loader');

      expect(loader).toBeInTheDocument();
    });
  });

  it('Redirects user to 404 page when error occurs', async () => {
    mockUseQuery.mockReturnValue({
      data: undefined,
      isPending: false,
      error: true,
    });

    render(<Index />);

    expect(useRouter().push).toHaveBeenCalledWith('/404');
  });

  it('Passes the correct count to SubmissionConfirmation component for a single submission', async () => {
    mockUseQuery.mockReturnValue({
      data: singleSubmissionData,
      isPending: false,
      error: false,
    });

    await act(async () => {
      render(<Index />);
    });

    await waitFor(() => {
      const submissionConfirmation = screen.getByRole('heading', { level: 1 });

      expect(submissionConfirmation).toHaveTextContent(
        '1 Annex VII record submitted'
      );
    });
  });

  it('Passes the correct count to SubmissionConfirmation component for a multiple submission', async () => {
    mockUseQuery.mockReturnValue({
      data: multipleSubmissionData,
      isPending: false,
      error: false,
    });

    await act(async () => {
      render(<Index />);
    });

    await waitFor(() => {
      const submissionConfirmation = screen.getByRole('heading', { level: 1 });

      expect(submissionConfirmation).toHaveTextContent(
        '100 Annex VII records submitted'
      );
    });
  });
});
