import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { UniqueReferenceForm } from './UniqueReferenceForm';
import userEvent from '@testing-library/user-event';

const formStrings = {
  errorSummaryHeading: 'There is a problem',
  inputLabel: 'Enter a reference',
  buttonLabel: 'Save and continue',
};

window.scrollTo = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

jest.mock('next-intl', () => ({
  useLocale: () => 'en',
}));

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ id: '1234' }),
  }),
) as jest.Mock;

describe('Unique reference form', () => {
  afterAll(() => {
    jest.clearAllMocks();
  });

  it('renders child elements errors', () => {
    render(
      <UniqueReferenceForm token="123ABC" formStrings={formStrings}>
        <p>This is a child element</p>
      </UniqueReferenceForm>,
    );

    expect(screen.getByText('This is a child element')).toBeInTheDocument();
  });

  it('renders the form with the label and text', () => {
    render(
      <UniqueReferenceForm token="123ABC" formStrings={formStrings}>
        <p>Child</p>
      </UniqueReferenceForm>,
    );

    expect(screen.getByLabelText('Enter a reference')).toBeInTheDocument();
  });

  it('renders the form with button and text', () => {
    render(
      <UniqueReferenceForm token="123ABC" formStrings={formStrings}>
        <p>Child</p>
      </UniqueReferenceForm>,
    );

    expect(
      screen.getByRole('button', { name: 'Save and continue' }),
    ).toBeInTheDocument();
  });

  it('displays the empty error message when form is submitted without input', () => {
    render(
      <UniqueReferenceForm token="123ABC" formStrings={formStrings}>
        <p>Child</p>
      </UniqueReferenceForm>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Save and continue' }));

    expect(screen.getByText('There is a problem')).toBeInTheDocument();
    const errorMessages = screen.getAllByText('Enter a unique reference');
    expect(errorMessages).toHaveLength(2);
  });

  it('displays the error message when form is submitted with invalid input', async () => {
    const user = userEvent.setup();

    render(
      <UniqueReferenceForm token="123ABC" formStrings={formStrings}>
        <p>Child</p>
      </UniqueReferenceForm>,
    );

    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();

    await user.type(input, '!!!!..,,,.,.,!');

    const submitButton = screen.getByRole('button', {
      name: 'Save and continue',
    });
    await user.click(submitButton);

    const errorMessages = screen.getAllByText(
      'The unique reference can only contain letters, numbers, hyphens, slashes, underscores and spaces',
    );
    expect(errorMessages).toHaveLength(2);
  });

  it('displays the error message when form is submitted with too long input', async () => {
    const user = userEvent.setup();

    render(
      <UniqueReferenceForm token="123ABC" formStrings={formStrings}>
        <p>Child</p>
      </UniqueReferenceForm>,
    );

    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();

    const longText = 'a'.repeat(21);

    await user.type(input, longText);

    const submitButton = screen.getByRole('button', {
      name: 'Save and continue',
    });
    await user.click(submitButton);

    const errorMessages = screen.getAllByText(
      'The unique reference must be 20 characters or less',
    );
    expect(errorMessages).toHaveLength(2);
  });

  it('disables the submit button when the form is being valiated', async () => {
    const user = userEvent.setup();

    render(
      <UniqueReferenceForm token="123ABC" formStrings={formStrings}>
        <p>Child</p>
      </UniqueReferenceForm>,
    );

    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();

    await user.type(input, 'my-reference-123');

    const submitButton = screen.getByRole('button', {
      name: 'Save and continue',
    });

    await user.click(submitButton);
    expect(submitButton).toBeDisabled();
  });
});
