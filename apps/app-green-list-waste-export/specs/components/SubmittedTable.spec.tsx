import '@testing-library/jest-dom';
import { render, screen, act } from 'jest-utils';
import { SubmittedTable, Transaction } from 'features/multiples';

const mockSubmissions: Transaction[] = [
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

    const transactionNumber = screen.getByText('2404_D7EDCE05');
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

    const wasteCode = screen.getByText('B1030');
    expect(wasteCode).toBeInTheDocument();
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
