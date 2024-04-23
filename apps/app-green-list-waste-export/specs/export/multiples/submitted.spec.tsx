import '@testing-library/jest-dom';
import { render, screen, act } from 'jest-utils';
import Index from 'pages/multiples/[id]/submitted';

global.fetch = jest.fn(
  () =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ data: {} }),
    }) as Promise<Response>
);

jest.mock('next/router', () => ({
  useRouter: () => ({
    query: {
      id: '123',
    },
    push: jest.fn(),
    events: {
      on: jest.fn(),
      off: jest.fn(),
    },
  }),
}));

jest.mock('@tanstack/react-query', () => ({
  ...jest.requireActual('@tanstack/react-query'),
  useQuery: () => ({
    isPending: false,
    error: null,
    data: {
      data: {
        state: {
          submissions: [
            [
              {
                id: '39d8e6a1-3f0a-4d98-a875-b2d71566f662',
                transactionId: '2404_D7EDCE05',
                hasEstimates: true,
                collectionDate: '2024-04-25T13:28:45.818Z',
                wasteCode: 'B1030',
                reference: 'ref1',
              },
              {
                id: 'f2715552-5a75-46a4-bc41-3044b5a6b35a',
                transactionId: '4722_K7EDCE25',
                hasEstimates: false,
                collectionDate: '2024-04-23T13:28:45.818Z',
                wasteCode: 'B1040',
                reference: 'ref2',
              },
            ],
          ],
        },
      },
    },
  }),
}));

describe('Submitted multiples page', () => {
  it('Renders without errors', async () => {
    await act(async () => {
      render(<Index />);
    });
  });

  it('Renders h1 with title string', async () => {
    await act(async () => {
      render(<Index />);
    });

    const heading = screen.getByRole('heading', {
      level: 1,
    });

    expect(heading).toBeInTheDocument();
  });
});
