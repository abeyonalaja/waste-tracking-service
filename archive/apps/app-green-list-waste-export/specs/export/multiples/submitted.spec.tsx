import '@testing-library/jest-dom';
import { render, screen, act } from 'jest-utils';
import Index from 'pages/multiples/[id]/submitted';

global.fetch = jest.fn(
  () =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ data: {} }),
    }) as Promise<Response>,
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
                submissionDeclaration: {
                  declarationTimestamp: '2024-04-26T09:45:50.656Z',
                  transactionId: '3497_1224DCBA',
                },
                hasEstimates: true,
                collectionDate: {
                  type: 'EstimateDate',
                  estimateDate: {
                    day: '03',
                    month: '01',
                    year: '2030',
                  },
                },
                wasteDescription: {
                  wasteCode: {
                    type: 'NotApplicable',
                  },
                  ewcCodes: [{ code: 'B1010' }],
                  description: 'metal',
                },
                reference: 'ref1',
              },
              {
                id: 'f2715552-5a75-46a4-bc41-3044b5a6b35a',
                submissionDeclaration: {
                  declarationTimestamp: '2024-04-26T09:45:50.656Z',
                  transactionId: '3497_1224DCBA',
                },
                hasEstimates: false,
                collectionDate: {
                  type: 'ActualDate',
                  actualDate: {
                    day: '03',
                    month: '01',
                    year: '2030',
                  },
                },
                wasteDescription: {
                  wasteCode: {
                    type: 'NotApplicable',
                  },
                  ewcCodes: [{ code: 'B1010' }],
                  description: 'metal',
                },
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
