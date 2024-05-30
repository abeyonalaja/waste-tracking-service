import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { render, act, screen } from 'jest-utils';
import { FeedbackForm } from 'features/feedback';

global.fetch = jest.fn(
  () =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ status: 'NotStarted' }),
    }) as Promise<Response>,
);

jest.mock('next/router', () => {
  const router = {
    back: jest.fn(),
    push: jest.fn(),
    pathname: '/',
    route: '',
    asPath: '',
    query: {},
    events: {
      on: jest.fn(),
      off: jest.fn(),
      emit: jest.fn(),
    },
  };
  return {
    useRouter: jest.fn().mockReturnValue(router),
  };
});

function TestForm() {
  return <FeedbackForm>{null}</FeedbackForm>;
}

describe('FeedbackForm component', () => {
  it('Renders without errors', async () => {
    await act(async () => {
      render(<TestForm />);
    });
  });

  it('Has an h2 heading', async () => {
    await act(async () => {
      render(<TestForm />);
    });

    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toBeInTheDocument();
  });

  it('Has the correct h2 heading text ', async () => {
    await act(async () => {
      render(<TestForm />);
    });

    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toHaveTextContent('Satisfaction survey');
  });

  it('Has the correct text for the radio button fieldset legend', async () => {
    await act(async () => {
      render(<TestForm />);
    });

    const legend = screen.getByText(
      'Overall, how did you feel about the service you received today?',
    );
    expect(legend).toBeInTheDocument();
  });

  it('Has a radio button with a label of "Very satisfied" and a value of 5', async () => {
    await act(async () => {
      render(<TestForm />);
    });

    const radio = screen.getByLabelText('Very satisfied');
    expect(radio).toHaveAttribute('value', '5');
  });

  it('Has a radio button with a label of "Satisfied" and a value of 4', async () => {
    await act(async () => {
      render(<TestForm />);
    });

    const radio = screen.getByLabelText('Satisfied');
    expect(radio).toHaveAttribute('value', '4');
  });

  it('Has a radio button with a label of "Neither satisfied or dissatisfied" and a value of 3', async () => {
    await act(async () => {
      render(<TestForm />);
    });

    const radio = screen.getByLabelText('Neither satisfied or dissatisfied');
    expect(radio).toHaveAttribute('value', '3');
  });

  it('Has a radio button with a label of "Dissatisfied" and a value of 2', async () => {
    await act(async () => {
      render(<TestForm />);
    });

    const radio = screen.getByLabelText('Dissatisfied');
    expect(radio).toHaveAttribute('value', '2');
  });

  it('Has a radio button with a label of "Very dissatisfied" and a value of 1', async () => {
    await act(async () => {
      render(<TestForm />);
    });

    const radio = screen.getByLabelText('Very dissatisfied');
    expect(radio).toHaveAttribute('value', '1');
  });

  it('Has the correct label text for the feedback textarea', async () => {
    await act(async () => {
      render(<TestForm />);
    });
    const label = screen.getByText('How could we improve this service?');
    expect(label).toBeInTheDocument();
  });

  it('Has the correct textarea hint text', async () => {
    await act(async () => {
      render(<TestForm />);
    });

    const hint = screen.getByText(
      'Do not include any business or personal information here, for example reference numbers or names.',
    );
    expect(hint).toBeInTheDocument();
  });

  it('Has a character count hint', async () => {
    await act(async () => {
      render(<TestForm />);
    });

    const hint = screen.getByText('You have 1200 characters remaining');
    expect(hint).toBeInTheDocument();
  });

  it("Has a text area with an aria-decribedby attribute that matches the character count hint's id", async () => {
    await act(async () => {
      render(<TestForm />);
    });

    const textarea = screen.getByRole('textbox');
    const hint = screen.getByText('You have 1200 characters remaining');
    expect(textarea).toHaveAttribute('aria-describedby', hint.id);
  });

  it('Updates the character count hint on user input', async () => {
    await act(async () => {
      render(<TestForm />);
    });

    const textarea = screen.getByRole('textbox');
    const hint = screen.getByText('You have 1200 characters remaining');
    expect(hint).toBeInTheDocument();
    textarea.focus();
    await userEvent.type(textarea, 'a');
    expect(hint).toHaveTextContent('You have 1199 characters remaining');
  });

  it('Has a submit button with the correct text', async () => {
    await act(async () => {
      render(<TestForm />);
    });

    const button = screen.getByRole('button', { name: 'Send feedback' });
    expect(button).toBeInTheDocument();
  });
});
