import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { WasteSourceForm } from './WasteSourceForm';
import userEvent from '@testing-library/user-event';

const formStrings = {
  radioOne: 'Commercial waste',
  radioTwo: 'Industrial waste',
  radioThree: 'Construction and demolition waste',
  radioFour: 'Household waste',
  buttonOne: 'Save and continue',
  buttonTwo: 'Save and return',
  errorSummaryTitle: 'There is a problem',
  errorMessage: 'Select the source of the waste',
};

window.scrollTo = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ id: '1234' }),
  }),
) as jest.Mock;

describe('Waste source form', () => {
  afterAll(() => {
    jest.clearAllMocks();
  });

  it('renders with child elements', () => {
    render(
      <WasteSourceForm id="123" token="ABC" formStrings={formStrings}>
        <p>Child element</p>
      </WasteSourceForm>,
    );

    const childElement = screen.getByText('Child element');
    expect(childElement).toBeInTheDocument();
  });

  it('renders the form with radio buttons', () => {
    render(
      <WasteSourceForm id="123" token="ABC" formStrings={formStrings}>
        <p>Child element</p>
      </WasteSourceForm>,
    );

    const radioOne = screen.getByLabelText('Commercial waste');
    const radioTwo = screen.getByLabelText('Industrial waste');
    const radioThree = screen.getByLabelText(
      'Construction and demolition waste',
    );
    const radioFour = screen.getByLabelText('Household waste');

    expect(radioOne).toBeInTheDocument();
    expect(radioTwo).toBeInTheDocument();
    expect(radioThree).toBeInTheDocument();
    expect(radioFour).toBeInTheDocument();
  });

  it('renders the form with save and continue and save and return buttons', () => {
    render(
      <WasteSourceForm id="123" token="ABC" formStrings={formStrings}>
        <p>Child element</p>
      </WasteSourceForm>,
    );

    const saveAndContinueButton = screen.getByRole('button', {
      name: 'Save and continue',
    });
    const saveAndReturnButton = screen.getByRole('button', {
      name: 'Save and return',
    });

    expect(saveAndContinueButton).toBeInTheDocument();
    expect(saveAndReturnButton).toBeInTheDocument();
  });

  it('displays error messages when no radio button is selected', async () => {
    const user = userEvent.setup();
    render(
      <WasteSourceForm id="123" token="ABC" formStrings={formStrings}>
        <p>Child element</p>
      </WasteSourceForm>,
    );

    const saveAndContinueButton = screen.getByRole('button', {
      name: 'Save and continue',
    });

    await user.click(saveAndContinueButton);

    const errorSummaryHeading = screen.getByText('There is a problem');
    const errorMessages = screen.getAllByText('Select the source of the waste');
    expect(errorSummaryHeading).toBeInTheDocument();
    expect(errorMessages).toHaveLength(2);
  });
});
