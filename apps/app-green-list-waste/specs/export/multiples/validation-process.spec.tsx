import '@testing-library/jest-dom';
import { render, screen, act } from 'jest-utils';
import { waitFor } from '@testing-library/react';
import * as ReactQuery from '@tanstack/react-query';
import Index from '../../../pages/multiples/[id]/index';
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
    query: {
      id: '1234',
      filename: 'test-file.csv',
    },
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

const loadingStateData = {
  data: {
    state: {
      status: 'Processing',
    },
  },
};

const successfulValidationData = {
  data: {
    state: {
      status: 'PassedValidation',
    },
  },
};

const failedValidationData = {
  data: {
    state: {
      status: 'FailedValidation',
    },
  },
};

describe('Validation Process page', () => {
  it('Renders without errors', async () => {
    mockUseQuery.mockReturnValue({
      data: successfulValidationData,
      isPending: false,
      error: false,
    });

    await act(async () => {
      render(<Index />);
    });
  });

  it('Redirects user to 404 page when error occurs', async () => {
    mockUseQuery.mockReturnValue({
      data: successfulValidationData,
      isPending: false,
      error: true,
    });

    await act(async () => {
      render(<Index />);
    });

    await waitFor(() => {
      expect(useRouter().push).toHaveBeenCalledWith('/404');
    });
  });

  it('Displays correct filename whilst loading', async () => {
    mockUseQuery.mockReturnValue({
      data: loadingStateData,
      isPending: true,
      error: false,
    });

    await act(async () => {
      render(<Index />);
    });

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { level: 1, name: 'Loading test-file.csv' })
      ).toBeInTheDocument();
    });
  });

  it('Redirects user to submit page when validation has passed', async () => {
    mockUseQuery.mockReturnValue({
      data: successfulValidationData,
      isPending: false,
      error: false,
    });

    await act(async () => {
      render(<Index />);
    });

    await waitFor(() => {
      expect(useRouter().push).toHaveBeenCalledWith(
        '/export/multiples/1234/submit'
      );
    });
  });

  it('Redirects user to validation errors page when validation has failed', async () => {
    mockUseQuery.mockReturnValue({
      data: failedValidationData,
      isPending: false,
      error: false,
    });

    await act(async () => {
      render(<Index />);
    });

    await waitFor(() => {
      expect(useRouter().push).toHaveBeenCalledWith(
        '/export/multiples/1234/errors?errors=true'
      );
    });
  });
});
