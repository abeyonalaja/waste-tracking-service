import '@testing-library/jest-dom';
import { render, screen, act } from 'jest-utils';
import { SubmittedTable, Transaction } from 'features/multiples';

const mockSubmissions: Transaction[] = [
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
        day: '25',
        month: '04',
        year: '2024',
      },
      actualDate: {},
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
    id: '39d8e6a1-3f0a-4d98-a875-b2d234234662',
    submissionDeclaration: {
      declarationTimestamp: '2024-04-26T09:45:50.656Z',
      transactionId: '1234_3497_12214DCCG',
    },
    hasEstimates: true,
    collectionDate: {
      type: 'ActualDate',
      actualDate: {
        day: '23',
        month: '04',
        year: '2024',
      },
      estimateDate: {},
    },
    wasteDescription: {
      wasteCode: {
        type: 'NotApplicable',
      },
      ewcCodes: [{ code: 'B1030' }],
      description: 'metal',
    },
    reference: 'ref2',
  },
];

const mockApiConfig: HeadersInit = {
  'Content-type': 'application/json',
  Authorization: 'Bearer token',
};

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
  }),
}));

jest.mock('utils/useRefDataLookup', () => jest.fn(() => jest.fn()));

describe('SubmittedTable component', () => {
  it('Renders without errors', async () => {
    await act(async () => {
      render(
        <SubmittedTable
          transactions={mockSubmissions}
          apiConfig={mockApiConfig}
          sortOrder={'asc'}
          pageNumber={1}
        />
      );
    });
  });

  it('Renders a table', async () => {
    await act(async () => {
      render(
        <SubmittedTable
          transactions={mockSubmissions}
          apiConfig={mockApiConfig}
          sortOrder={'asc'}
          pageNumber={1}
        />
      );
    });
    const table = screen.getByRole('table');
    expect(table).toBeInTheDocument();
  });

  it('Renders the correct number of rows', async () => {
    await act(async () => {
      render(
        <SubmittedTable
          transactions={mockSubmissions}
          apiConfig={mockApiConfig}
          sortOrder={'asc'}
          pageNumber={1}
        />
      );
    });

    const rows = screen.getAllByRole('row');
    expect(rows).toHaveLength(mockSubmissions.length);
  });

  it('Has the correct table headings', async () => {
    await act(async () => {
      render(
        <SubmittedTable
          transactions={mockSubmissions}
          apiConfig={mockApiConfig}
          sortOrder={'asc'}
          pageNumber={1}
        />
      );
    });

    const transactionNumberHeading = screen.getByText('Transaction number');
    expect(transactionNumberHeading).toBeInTheDocument();

    const collectionDateHeading = screen.getByText('Collection date');
    expect(collectionDateHeading).toBeInTheDocument();

    const wasteCodeHeading = screen.getByText('Waste code');
    expect(wasteCodeHeading).toBeInTheDocument();

    const uniqueReferenceHeading = screen.getByText('Your unique reference');
    expect(uniqueReferenceHeading).toBeInTheDocument();

    const actionHeading = screen.getByText('Action');
    expect(actionHeading).toBeInTheDocument();
  });

  it('Renders transaction number', async () => {
    await act(async () => {
      render(
        <SubmittedTable
          transactions={mockSubmissions}
          apiConfig={mockApiConfig}
          sortOrder={'asc'}
          pageNumber={1}
        />
      );
    });

    const transactionNumber = screen.getByText('3497_1224DCBA');
    expect(transactionNumber).toBeInTheDocument();
  });

  it('Renders formatted collection dates', async () => {
    await act(async () => {
      render(
        <SubmittedTable
          transactions={mockSubmissions}
          apiConfig={mockApiConfig}
          sortOrder={'asc'}
          pageNumber={1}
        />
      );
    });

    const collectionDate = screen.getByText('25/04/2024');
    expect(collectionDate).toBeInTheDocument();

    const collectionDate2 = screen.getByText('23/04/2024');
    expect(collectionDate2).toBeInTheDocument();
  });

  it('Renders waste code', async () => {
    await act(async () => {
      render(
        <SubmittedTable
          transactions={mockSubmissions}
          apiConfig={mockApiConfig}
          sortOrder={'asc'}
          pageNumber={1}
        />
      );
    });

    const wasteCode = screen.getAllByText('N/A');
    expect(wasteCode).toBeTruthy();
  });

  it('Renders unique reference', async () => {
    await act(async () => {
      render(
        <SubmittedTable
          transactions={mockSubmissions}
          apiConfig={mockApiConfig}
          sortOrder={'asc'}
          pageNumber={1}
        />
      );
    });

    const uniqueReference = screen.getByText('ref1');
    expect(uniqueReference).toBeInTheDocument();
  });

  it('renders a link to view the transaction', async () => {
    await act(async () => {
      render(
        <SubmittedTable
          transactions={mockSubmissions}
          apiConfig={mockApiConfig}
          sortOrder={'asc'}
          pageNumber={1}
        />
      );
    });

    const link = screen.getAllByRole('link')[0];
    expect(link).toHaveTextContent('View');

    expect(link).toHaveAttribute(
      'href',
      '/multiples/123/view/39d8e6a1-3f0a-4d98-a875-b2d71566f662?sort=asc&page=1'
    );
  });
});
