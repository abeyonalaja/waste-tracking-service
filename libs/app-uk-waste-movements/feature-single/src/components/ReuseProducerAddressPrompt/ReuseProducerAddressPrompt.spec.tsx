import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ReuseProducerAddressPrompt } from './ReuseProducerAddressPrompt';

const formStrings = {
  radioOne: 'Yes, I want to use this address for the waste collection',
  radioTwo: 'No, I want to enter a different address for the waste collection',
  buttonOne: 'Save and continue',
  buttonTwo: 'Save and return',
  errorSummaryTitle: 'There is a problem',
  validationError:
    'Select yes if the waste collection address is the same as the producer address',
};

window.scrollTo = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
  }),
}));

describe('ReuseProducerAddressPrompt', () => {
  afterAll(() => {
    jest.clearAllMocks();
  });

  it('renders children elements', () => {
    render(
      <ReuseProducerAddressPrompt id="123" formStrings={formStrings}>
        <p>I am a child element</p>
      </ReuseProducerAddressPrompt>,
    );

    expect(screen.getByText('I am a child element')).toBeInTheDocument();
  });

  it('has a radio button for "Yes" with the correct value', () => {
    render(
      <ReuseProducerAddressPrompt id="123" formStrings={formStrings}>
        <p>Child element</p>
      </ReuseProducerAddressPrompt>,
    );

    const radioForYes = screen.getByLabelText(
      'Yes, I want to use this address for the waste collection',
    );

    expect(radioForYes).toBeInTheDocument();
    expect(radioForYes).toHaveAttribute('value', 'yes');
  });

  it('has a radio button for "No" with the correct value', () => {
    render(
      <ReuseProducerAddressPrompt id="123" formStrings={formStrings}>
        <p>Child element</p>
      </ReuseProducerAddressPrompt>,
    );

    const radioForNo = screen.getByLabelText(
      'No, I want to enter a different address for the waste collection',
    );

    expect(radioForNo).toBeInTheDocument();
    expect(radioForNo).toHaveAttribute('value', 'no');
  });

  it('has a submit button with the correct text', () => {
    render(
      <ReuseProducerAddressPrompt id="123" formStrings={formStrings}>
        <p>Child element</p>
      </ReuseProducerAddressPrompt>,
    );

    const submitButton = screen.getByRole('button', {
      name: 'Save and continue',
    });

    expect(submitButton).toBeInTheDocument();
  });

  it('has a link which with an href back to the task list', () => {
    render(
      <ReuseProducerAddressPrompt id="123" formStrings={formStrings}>
        <p>Child element</p>
      </ReuseProducerAddressPrompt>,
    );

    const backLink = screen.getByRole('link', { name: 'Save and return' });

    expect(backLink).toHaveAttribute('href', '/single/123');
  });

  it('shows an error message when the form is submitted without selecting an option', async () => {
    render(
      <ReuseProducerAddressPrompt id="123" formStrings={formStrings}>
        <p>Child element</p>
      </ReuseProducerAddressPrompt>,
    );

    const submitButton = screen.getByRole('button', {
      name: 'Save and continue',
    });

    await userEvent.click(submitButton);

    const errorSummaryHeading = screen.getByText('There is a problem');
    const validationErrors = screen.getAllByText(
      'Select yes if the waste collection address is the same as the producer address',
    );

    expect(errorSummaryHeading).toBeInTheDocument();
    expect(validationErrors).toHaveLength(2);
  });
});
