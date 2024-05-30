import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { SubmissionConfirmation } from './SubmissionConfirmation';
import { NextIntlClientProvider } from 'next-intl';

const messages = {
  multiples: {
    confirmation: {
      banner:
        '{count} waste {count, plural, =1 {movement} other {movements}} created',
      subHeading1: 'What you must do next',
      bodyP1:
        'Now you have created these waste movements, you need to notify other involved parties of any relevant movements.',
      bodyP2: 'You can also:',
      bullet1:
        'view all these created waste movement records (opens in new tab)',
      subHeading2: 'What happens next',
      bodyP3:
        'The receivers of the waste will need to confirm collection and receipt of the waste using the waste tracking service.',
      button: 'Return to move waste in the UK',
    },
  },
};

beforeEach(() => {
  process.env = {
    NODE_ENV: 'test',
    UKWM_URL: '/',
  };
});

describe('Submission Confirmation component', () => {
  test('renders banner correctly with 5 records', async () => {
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <SubmissionConfirmation submissionId="123" recordCount={5} />
      </NextIntlClientProvider>,
    );
    expect(screen.getByText('5 waste movements created')).toBeInTheDocument();
  });

  test('renders banner correctly with 1 record', async () => {
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <SubmissionConfirmation submissionId="123" recordCount={1} />
      </NextIntlClientProvider>,
    );
    expect(screen.getByText('1 waste movement created')).toBeInTheDocument();
  });

  test('view records link URL is correct', async () => {
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <SubmissionConfirmation
          submissionId="fa9fb092-1b60-4391-bf08-5cc8d60606b5"
          recordCount={548}
        />
      </NextIntlClientProvider>,
    );
    expect(
      screen.getByText(messages.multiples.confirmation.bullet1.toString()),
    ).toHaveAttribute(
      'href',
      '/en/multiples/fa9fb092-1b60-4391-bf08-5cc8d60606b5/view?page=1',
    );
  });
});
