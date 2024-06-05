import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { SubmittedTable } from './SubmittedTable';
import { UkwmSubmissionReference } from '@wts/api/waste-tracking-gateway';
import { NextIntlClientProvider } from 'next-intl';

const messages = {
  multiples: {
    manage: {
      breadCrumbs: {
        home: 'Home',
        moveWaste: 'Move waste in the UK',
        current: 'Manage waste movements',
      },
      headingOne: 'Waste movement records for {company}',
      table: {
        headerOne: 'Waste movement ID',
        headerTwo: 'Collection date',
        headerThree: 'EWC code',
        headerFour: 'Producer name',
        headerFive: 'Action',
        action: 'Action',
        notFound: 'No record found',
      },
      submittedTable: {
        filters: {
          heading: 'Filter',
          show: 'Show',
          hide: 'Hide',
          showAll: 'Show all sections',
          hideAll: 'Hide all sections',
          collectionDate: {
            title: 'Collection Date',
            hint: 'The date the waste was collected from the producer',
            error: 'Enter the full date',
            labelOne: 'Day',
            labelTwo: 'Month',
            labelThree: 'Year',
          },
          ewcCode: {
            title: 'EWC Code',
            hint: 'Search for any EWC code in your waste movements',
          },
          producerName: {
            title: 'Producer name',
            hint: 'Search for a producer name',
          },
          wasteMovementId: {
            title: 'Waste Movement ID',
            hint: 'Search for a waste movement ID',
          },
          buttons: {
            apply: 'Apply filters',
            reset: 'Reset filters',
          },
        },
      },
    },
  },
};

const strings = {
  headerOne: 'Waste movement ID',
  headerTwo: 'Collection date',
  headerThree: 'EWC codes',
  headerFour: 'Producer name',
  headerFive: 'Action',
  action: 'View',
  notFound: 'No submissions found',
};

const mockSubmisssions: UkwmSubmissionReference[] = [
  {
    id: '121',
    wasteMovementId: 'WM2405_01',
    producerName: 'Test Producer 1',
    ewcCodes: ['150101'],
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
    ewcCodes: ['150102'],
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
    ewcCodes: ['150103'],
    collectionDate: {
      day: '03',
      month: '01',
      year: '2024',
    },
  },
];

jest.mock('@wts/ui/navigation', () => ({
  ...jest.requireActual('@wts/ui/navigation'),
  usePathname: jest.fn(() => '/multiples/1234/view'),
}));

const setPageNumber = jest.fn();

jest.mock('next/navigation', () => {
  return {
    ...jest.requireActual('next/navigation'),
    useSearchParams: jest.fn(() => ({
      get: setPageNumber,
    })),
  };
});

describe('SubmittedTable component', () => {
  it('displays the waste movement Ids for the submissions', async () => {
    setPageNumber.mockReturnValue(1);

    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <SubmittedTable submissions={mockSubmisssions} tableStrings={strings} />
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
    setPageNumber.mockReturnValue(1);

    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <SubmittedTable submissions={mockSubmisssions} tableStrings={strings} />
      </NextIntlClientProvider>,
    );

    const collectionDate = screen.getByText(/01\s*\/\s*01\s*\/\s*2024/s);

    expect(collectionDate).toBeInTheDocument();
  });

  it('displays the first EWC code of the submission', () => {
    setPageNumber.mockReturnValue(1);

    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <SubmittedTable submissions={mockSubmisssions} tableStrings={strings} />
      </NextIntlClientProvider>,
    );

    const ewcCodeOne = screen.getByText('150101');

    expect(ewcCodeOne).toBeInTheDocument();
  });

  it('displays the producer name', () => {
    setPageNumber.mockReturnValue(1);

    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <SubmittedTable submissions={mockSubmisssions} tableStrings={strings} />
      </NextIntlClientProvider>,
    );

    const producerName = screen.getByText('Test Producer 1');

    expect(producerName).toBeInTheDocument();
  });

  it('Has a link to view the individual submission', () => {
    setPageNumber.mockReturnValue(1);

    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <SubmittedTable submissions={mockSubmisssions} tableStrings={strings} />
      </NextIntlClientProvider>,
    );

    const viewLinks = screen.getAllByRole('link', { name: 'View' });

    expect(viewLinks).toHaveLength(3);
  });
});
