import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import { FeedbackForm } from 'components';
import { useForm, FormProvider } from 'react-hook-form';
import { SendFeedbackRequest } from '@wts/api/feedback';

function TestForm() {
  const methods = useForm<SendFeedbackRequest>();
  return (
    <FormProvider {...methods}>
      <FeedbackForm
        onSubmit={jest.fn()}
        validateFeedback={jest.fn()}
        isPending={false}
      />
    </FormProvider>
  );
}

describe('FeedbackForm component', () => {
  it('Renders without errors', () => {
    render(<TestForm />);
  });

  it('Has an h2 heading', () => {
    render(<TestForm />);
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toBeInTheDocument();
  });

  it('Has the correct h2 heading text ', () => {
    render(<TestForm />);
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toHaveTextContent('Satisfaction survey');
  });

  it('Has the correct text for the radio button fieldset legend', () => {
    render(<TestForm />);
    const legend = screen.getByText(
      'Overall, how did you feel about the service you received today?'
    );
    expect(legend).toBeInTheDocument();
  });

  it('Has a radio button with a label of "Very satisfied" and a value of 5', () => {
    render(<TestForm />);
    const radio = screen.getByLabelText('Very satisfied');
    expect(radio).toHaveAttribute('value', '5');
  });

  it('Has a radio button with a label of "Satisfied" and a value of 4', () => {
    render(<TestForm />);
    const radio = screen.getByLabelText('Satisfied');
    expect(radio).toHaveAttribute('value', '4');
  });

  it('Has a radio button with a label of "Neither satisfied or dissatisfied" and a value of 3', () => {
    render(<TestForm />);
    const radio = screen.getByLabelText('Neither satisfied or dissatisfied');
    expect(radio).toHaveAttribute('value', '3');
  });

  it('Has a radio button with a label of "Dissatisfied" and a value of 2', () => {
    render(<TestForm />);
    const radio = screen.getByLabelText('Dissatisfied');
    expect(radio).toHaveAttribute('value', '2');
  });

  it('Has a radio button with a label of "Very dissatisfied" and a value of 1', () => {
    render(<TestForm />);
    const radio = screen.getByLabelText('Very dissatisfied');
    expect(radio).toHaveAttribute('value', '1');
  });

  it('Has the correct label text for the feedback textarea', () => {
    render(<TestForm />);
    const label = screen.getByText('How could we improve this service?');
    expect(label).toBeInTheDocument();
  });

  it('Has the correct textarea hint text', () => {
    render(<TestForm />);
    const hint = screen.getByText(
      'Do not include any business or personal information here, for example reference numbers or names.'
    );
    expect(hint).toBeInTheDocument();
  });

  it('Has a character count hint', () => {
    render(<TestForm />);
    const hint = screen.getByText('You have 1200 characters remaining');
    expect(hint).toBeInTheDocument();
  });

  it("Has a text area with an aria-decribedby attribute that matches the character count hint's id", () => {
    render(<TestForm />);
    const textarea = screen.getByRole('textbox');
    const hint = screen.getByText('You have 1200 characters remaining');
    expect(textarea).toHaveAttribute('aria-describedby', hint.id);
  });

  it('Updates the character count hint on user input', async () => {
    render(<TestForm />);
    const textarea = screen.getByRole('textbox');
    const hint = screen.getByText('You have 1200 characters remaining');
    expect(hint).toBeInTheDocument();
    textarea.focus();
    await userEvent.type(textarea, 'a');
    expect(hint).toHaveTextContent('You have 1199 characters remaining');
  });

  it('Has a submit button with the correct text', () => {
    render(<TestForm />);
    const button = screen.getByRole('button', { name: 'Send feedback' });
    expect(button).toBeInTheDocument();
  });

  it('Has a disabled submit button when isPending is true', () => {
    function TestFormWithDisabledButton() {
      const methods = useForm<SendFeedbackRequest>();
      return (
        <FormProvider {...methods}>
          <FeedbackForm
            onSubmit={jest.fn()}
            validateFeedback={jest.fn()}
            isPending={true}
          />
        </FormProvider>
      );
    }
    render(<TestFormWithDisabledButton />);

    const button = screen.getByRole('button', { name: 'Send feedback' });
    expect(button).toBeDisabled();
  });

  it('Calls onSubmit function when submit button is pressed', async () => {
    const mockSubmit = jest.fn();

    function TestFormWithMockSubmit() {
      const methods = useForm<SendFeedbackRequest>();
      return (
        <FormProvider {...methods}>
          <FeedbackForm
            onSubmit={mockSubmit}
            validateFeedback={jest.fn()}
            isPending={false}
          />
        </FormProvider>
      );
    }

    render(<TestFormWithMockSubmit />);

    const button = screen.getByRole('button', { name: 'Send feedback' });
    await userEvent.click(button);
    expect(mockSubmit).toHaveBeenCalled();
  });

  it("Calls validateFeedback function when submit button is pressed and there's text in the textarea", async () => {
    const mockValidate = jest.fn();
    function TestFormWithMockValidate() {
      const methods = useForm<SendFeedbackRequest>();

      return (
        <FormProvider {...methods}>
          <FeedbackForm
            onSubmit={jest.fn()}
            validateFeedback={mockValidate}
            isPending={false}
          />
        </FormProvider>
      );
    }

    render(<TestFormWithMockValidate />);

    const textarea = screen.getByRole('textbox');
    const button = screen.getByRole('button', { name: 'Send feedback' });

    await userEvent.type(textarea, 'a');
    await userEvent.click(button);

    expect(mockValidate).toHaveBeenCalled();
  });
});
