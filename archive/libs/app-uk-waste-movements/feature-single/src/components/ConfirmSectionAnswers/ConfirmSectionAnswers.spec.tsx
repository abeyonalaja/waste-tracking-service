import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { ConfirmSectionAnswers } from './ConfirmSectionAnswers';
import userEvent from '@testing-library/user-event';

const formStrings = {
  legendText: 'Have you completed this section?',
  radioOne: 'Yes',
  radioTwo: 'No',
  button: 'Save and continue',
  errorSummaryTitle: 'There is a problem',
  validationError: 'Select whether you’ve completed this section',
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

describe('Confirm section answers component', () => {
  it('renders child elements', () => {
    render(
      <ConfirmSectionAnswers
        token="123"
        endpoint="/api/mock-endpoin"
        nextPage="/mock-page"
        formStrings={formStrings}
      >
        <p>I am a child element</p>
      </ConfirmSectionAnswers>,
    );

    const childElement = screen.getByText(/I am a child element/);

    expect(childElement).toBeInTheDocument();
  });

  it('renders legend text as heading', () => {
    render(
      <ConfirmSectionAnswers
        token="123"
        endpoint="/api/mock-endpoin"
        nextPage="/mock-page"
        formStrings={formStrings}
      >
        <p>I am a child element</p>
      </ConfirmSectionAnswers>,
    );

    const heading = screen.getByRole('heading', {
      name: 'Have you completed this section?',
    });

    expect(heading).toBeInTheDocument();
  });

  it('renders radio buttons', () => {
    render(
      <ConfirmSectionAnswers
        token="123"
        endpoint="/api/mock-endpoin"
        nextPage="/mock-page"
        formStrings={formStrings}
      >
        <p>I am a child element</p>
      </ConfirmSectionAnswers>,
    );

    const radioOne = screen.getByLabelText('Yes');
    const radioTwo = screen.getByLabelText('No');

    expect(radioOne).toBeInTheDocument();
    expect(radioTwo).toBeInTheDocument();
  });

  it('renders a call-to-action button', () => {
    render(
      <ConfirmSectionAnswers
        token="123"
        endpoint="/api/mock-endpoin"
        nextPage="/mock-page"
        formStrings={formStrings}
      >
        <p>I am a child element</p>
      </ConfirmSectionAnswers>,
    );

    const button = screen.getByRole('button', { name: 'Save and continue' });

    expect(button).toBeInTheDocument();
  });

  it('displays an error summary heading when no radio button is selected', async () => {
    const user = userEvent.setup();

    render(
      <ConfirmSectionAnswers
        token="123"
        endpoint="/api/mock-endpoin"
        nextPage="/mock-page"
        formStrings={formStrings}
      >
        <p>I am a child element</p>
      </ConfirmSectionAnswers>,
    );

    expect(screen.queryByText('There is a problem')).not.toBeInTheDocument();

    const submitButton = screen.getByRole('button', {
      name: 'Save and continue',
    });

    await user.click(submitButton);

    const errorSummaryHeading = screen.getByRole('heading', {
      level: 2,
      name: 'There is a problem',
    });

    expect(errorSummaryHeading).toBeInTheDocument();
  });

  it('displays error messages when no radio button is selected', async () => {
    const user = userEvent.setup();

    render(
      <ConfirmSectionAnswers
        token="123"
        endpoint="/api/mock-endpoin"
        nextPage="/mock-page"
        formStrings={formStrings}
      >
        <p>I am a child element</p>
      </ConfirmSectionAnswers>,
    );

    expect(
      screen.queryAllByText('Select the source of the waste'),
    ).toHaveLength(0);

    const submitButton = screen.getByRole('button', {
      name: 'Save and continue',
    });

    await user.click(submitButton);

    const errorMessages = screen.getAllByText(
      'Select whether you’ve completed this section',
    );

    expect(errorMessages).toHaveLength(2);
  });
});
