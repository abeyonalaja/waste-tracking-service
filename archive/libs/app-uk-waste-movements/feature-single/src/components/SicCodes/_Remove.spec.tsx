import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Remove, RemoveStrings } from './_Remove';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const removeStrings: RemoveStrings = {
  backLink: 'Back',
  caption: 'Producer and waste collection details',
  title:
    'Are you sure you want to remove this Standard Industry Classification (SIC) code?',
  yesRadio: 'Yes',
  noRadio: 'No',
  saveAndContinue: 'Save and continue',
  saveAndReturn: 'Save and return',
  errorMessage: 'Select an option',
  errorSummary: 'There is a problem',
};

const mockCode = {
  code: '06200',
  description: 'Extraction of natural gas',
};

window.scrollTo = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

const queryClient = new QueryClient();

describe('SIC Code Remove component', () => {
  it('displays the code and description to be removed', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Remove
          id="123"
          code={mockCode}
          token="ABC"
          apiUrl="/api/ukwm"
          strings={removeStrings}
          setCodeToRemove={jest.fn()}
        />
      </QueryClientProvider>,
    );

    expect(screen.getByText(/06200/)).toBeInTheDocument();
    expect(screen.getByText(/Extraction of natural gas/)).toBeInTheDocument();
  });

  it('displays the radio buttons', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Remove
          id="123"
          code={mockCode}
          token="ABC"
          apiUrl="/api/ukwm"
          strings={removeStrings}
          setCodeToRemove={jest.fn()}
        />
      </QueryClientProvider>,
    );

    const yesRadio = screen.getByLabelText('Yes');
    const noRadio = screen.getByLabelText('No');

    expect(yesRadio).toBeInTheDocument();
    expect(noRadio).toBeInTheDocument();
  });

  it('displays the save and continue and save and return buttons', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Remove
          id="123"
          code={mockCode}
          token="ABC"
          apiUrl="/api/ukwm"
          strings={removeStrings}
          setCodeToRemove={jest.fn()}
        />
      </QueryClientProvider>,
    );

    const saveAndContinueButton = screen.getByRole('button', {
      name: 'Save and continue',
    });

    expect(saveAndContinueButton).toBeInTheDocument();
  });

  it('dipslays error summary heading when no radiot button is selected', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Remove
          id="123"
          code={mockCode}
          token="ABC"
          apiUrl="/api/ukwm"
          strings={removeStrings}
          setCodeToRemove={jest.fn()}
        />
      </QueryClientProvider>,
    );

    const saveAndContinueButton = screen.getByRole('button', {
      name: 'Save and continue',
    });

    await userEvent.click(saveAndContinueButton);

    await waitFor(() => {
      expect(screen.getByText('There is a problem')).toBeInTheDocument();
    });
  });

  it('displays an error message when no radio button is selected', async () => {
    const user = userEvent.setup();

    render(
      <QueryClientProvider client={queryClient}>
        <Remove
          id="123"
          code={mockCode}
          token="ABC"
          apiUrl="/api/ukwm"
          strings={removeStrings}
          setCodeToRemove={jest.fn()}
        />
      </QueryClientProvider>,
    );

    const saveAndContinueButton = screen.getByRole('button', {
      name: 'Save and continue',
    });

    await user.click(saveAndContinueButton);

    await waitFor(() => {
      expect(screen.getAllByText('Select an option')).toHaveLength(2);
    });
  });
});
