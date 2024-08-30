import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Add, AddStrings } from './_Add';
import {
  useQuery,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';

const addStrings: AddStrings = {
  title: 'Do you need to add another SIC code?',
  label: 'Choose from the list or start typing',
  hiddenError: 'Error: ',
  selectionErrorMessage: 'Select yes if you want to add another SIC code',
  errorMessageEmpty: 'Enter a code',
  errorMessageDuplicate: 'You have already added this SIC code',
  yesRadio: 'Yes',
  noRadio: 'No',
  saveAndContinue: 'Save and continue',
  saveAndReturn: 'Save and return',
  errorSummary: 'There is a problem',
};

const moockReferenceData = {
  data: [
    {
      code: '01290',
      description: {
        en: 'Growing of other perennial crops',
        cy: 'Tyfu cnydau parhaol eraill',
      },
    },
    {
      code: '01300',
      description: {
        en: 'Plant propagation',
        cy: 'Plannu',
      },
    },
    {
      code: '01410',
      description: {
        en: 'Raising of dairy cattle',
        cy: 'Coddi gwartheg llaeth',
      },
    },
  ],
};

window.scrollTo = jest.fn();
global.TextEncoder = TextEncoder;

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@tanstack/react-query', () => {
  const originalModule = jest.requireActual('@tanstack/react-query');
  return {
    ...originalModule,
    useQuery: jest.fn(),
  };
});

jest.mock('next-intl', () => ({
  useLocale: jest.fn(() => 'en'),
}));

const mockUseQuery = useQuery as jest.Mock;

const queryClient = new QueryClient();

describe('SIC Code Add component', () => {
  it('displays label for input on first addition', () => {
    mockUseQuery.mockReturnValue({
      data: moockReferenceData,
      isPending: false,
      error: false,
    });

    render(
      <QueryClientProvider client={queryClient}>
        <Add
          id="123"
          token="ABC"
          addedCodes={['06200']}
          strings={addStrings}
          apiUrl="/api/ukwm"
        >
          <p>Child component</p>
        </Add>
      </QueryClientProvider>,
    );

    const label = screen.getByText('Choose from the list or start typing');

    expect(label).toBeInTheDocument();
  });

  it('does not display a secondary heading when no codes have already been added', () => {
    mockUseQuery.mockReturnValue({
      data: moockReferenceData,
      isPending: false,
      error: false,
    });

    render(
      <QueryClientProvider client={queryClient}>
        <Add
          id="123"
          token="ABC"
          addedCodes={[]}
          strings={addStrings}
          apiUrl="/api/ukwm"
        >
          <p>Child component</p>
        </Add>
      </QueryClientProvider>,
    );

    const secondaryHeading = screen.queryByText(
      'Do you need to add another SIC code?',
    );

    expect(secondaryHeading).not.toBeInTheDocument();
  });

  it('does display a secondary heading when codes have already been added', () => {
    mockUseQuery.mockReturnValue({
      data: moockReferenceData,
      isPending: false,
      error: false,
    });

    render(
      <QueryClientProvider client={queryClient}>
        <Add
          id="123"
          token="ABC"
          addedCodes={['06200']}
          strings={addStrings}
          apiUrl="/api/ukwm"
        >
          <p>Child component</p>
        </Add>
      </QueryClientProvider>,
    );

    const secondaryHeading = screen.getByText(
      'Do you need to add another SIC code?',
    );

    expect(secondaryHeading).toBeInTheDocument();
  });

  it('displays primary and secondary action buttons', () => {
    mockUseQuery.mockReturnValue({
      data: moockReferenceData,
      isPending: false,
      error: false,
    });

    render(
      <QueryClientProvider client={queryClient}>
        <Add
          id="123"
          token="ABC"
          addedCodes={['06200']}
          strings={addStrings}
          apiUrl="/api/ukwm"
        >
          <p>Child component</p>
        </Add>
      </QueryClientProvider>,
    );

    const saveAndContinue = screen.getByText('Save and continue');
    const saveAndReturn = screen.getByText('Save and return');

    expect(saveAndContinue).toBeInTheDocument();
    expect(saveAndReturn).toBeInTheDocument();
  });

  it('it displays error summary heading when no SIC code is selected', async () => {
    const user = userEvent.setup();
    mockUseQuery.mockReturnValue({
      data: moockReferenceData,
      isPending: false,
      error: false,
    });

    render(
      <QueryClientProvider client={queryClient}>
        <Add
          id="123"
          token="ABC"
          addedCodes={['06200']}
          strings={addStrings}
          apiUrl="/api/ukwm"
        >
          <p>Child component</p>
        </Add>
      </QueryClientProvider>,
    );

    const saveAndContinue = screen.getByText('Save and continue');
    await user.click(saveAndContinue);

    await waitFor(() => {
      const errorSummary = screen.getByText('There is a problem');

      expect(errorSummary).toBeInTheDocument();
    });
  });

  it('displays error message when no SIC code is selected and there are not existing added codes ', async () => {
    const user = userEvent.setup();
    mockUseQuery.mockReturnValue({
      data: moockReferenceData,
      isPending: false,
      error: false,
    });

    render(
      <QueryClientProvider client={queryClient}>
        <Add
          id="123"
          token="ABC"
          addedCodes={[]}
          strings={addStrings}
          apiUrl="/api/ukwm"
        >
          <p>Child component</p>
        </Add>
      </QueryClientProvider>,
    );

    const saveAndContinue = screen.getByText('Save and continue');
    await user.click(saveAndContinue);

    await waitFor(() => {
      const errorMessages = screen.getAllByText('Enter a code');

      expect(errorMessages).toHaveLength(2);
    });
  });

  it('displays error message when no SIC code is selected and there are existing added codes ', async () => {
    const user = userEvent.setup();
    mockUseQuery.mockReturnValue({
      data: moockReferenceData,
      isPending: false,
      error: false,
    });

    render(
      <QueryClientProvider client={queryClient}>
        <Add
          id="123"
          token="ABC"
          addedCodes={['06200']}
          strings={addStrings}
          apiUrl="/api/ukwm"
        >
          <p>Child component</p>
        </Add>
      </QueryClientProvider>,
    );

    const saveAndContinue = screen.getByText('Save and continue');
    await user.click(saveAndContinue);

    await waitFor(() => {
      const errorMessages = screen.getAllByText(
        'Select yes if you want to add another SIC code',
      );

      expect(errorMessages).toHaveLength(2);
    });
  });
});
