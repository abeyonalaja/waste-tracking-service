import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { SubmittedTable } from './SubmittedTable';
import { NextIntlClientProvider } from 'next-intl';
import { BulkSubmissionPartialSummary } from '@wts/api/uk-waste-movements-bulk';

const messages = {
  multiples: {
    manage: {
      table: {
        headerOne: 'Waste movement ID',
        headerTwo: 'Collection date',
        headerThree: 'EWC code',
        headerFour: 'Producer name',
        headerFive: 'Action',
        action: 'View',
        notFound: 'No record found',
      },
    },
  },
};

const mockSubmisssions: BulkSubmissionPartialSummary[] = [
  {
    id: '121',
    wasteMovementId: 'WM2405_01',
    producerName: 'Test Producer 1',
    ewcCode: '150101',
    collectionDate: {
      day: '01',
      month: '01',
      year: '2024',
    },
  },
  {
    id: '122',
    wasteMovementId: 'WM2405_02',
    producerName: 'Test Producer 2',
    ewcCode: '150102',
    collectionDate: {
      day: '02',
      month: '01',
      year: '2024',
    },
  },
  {
    id: '123',
    wasteMovementId: 'WM2405_03',
    producerName: 'Test Producer 3',
    ewcCode: '150103',
    collectionDate: {
      day: '03',
      month: '01',
      year: '2024',
    },
  },
];

describe('SubmittedTable component', () => {
  it('displays the waste movement Ids for the submissions', async () => {
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <SubmittedTable submissions={mockSubmisssions} />,
      </NextIntlClientProvider>,
    );

    const idOne = screen.getByText(/WM2405_01/);
    const idTwo = screen.getByText(/WM2405_02/);
    const idThree = screen.getByText(/WM2405_03/);

    expect(idOne).toBeInTheDocument();
    expect(idTwo).toBeInTheDocument();
    expect(idThree).toBeInTheDocument();
  });

  it('displays the collection date of the waste movement', () => {
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <SubmittedTable submissions={mockSubmisssions} />
      </NextIntlClientProvider>,
    );

    const collectionDate = screen.getByText(/01\s*\/\s*01\s*\/\s*2024/s);

    expect(collectionDate).toBeInTheDocument();
  });

  it('displays the first EWC code of the submission', () => {
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <SubmittedTable submissions={mockSubmisssions} />
      </NextIntlClientProvider>,
    );

    const ewcCodeOne = screen.getByText('150101');

    expect(ewcCodeOne).toBeInTheDocument();
  });

  it('displays the producer name', () => {
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <SubmittedTable submissions={mockSubmisssions} />
      </NextIntlClientProvider>,
    );

    const producerName = screen.getByText('Test Producer 1');

    expect(producerName).toBeInTheDocument();
  });

  it('Has a link to view the individual submission', () => {
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <SubmittedTable submissions={mockSubmisssions} />
      </NextIntlClientProvider>,
    );

    const viewLinks = screen.getAllByRole('link', { name: 'View' });

    expect(viewLinks).toHaveLength(3);
  });
});
