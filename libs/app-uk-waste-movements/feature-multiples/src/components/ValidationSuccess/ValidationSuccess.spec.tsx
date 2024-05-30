import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { ValidationSuccess } from './ValidationSuccess';
import { NextIntlClientProvider } from 'next-intl';

const messages = {
  multiples: {
    success: {
      notificationTitle: 'Success',
      heading:
        'You have no errors in your {count} waste movement {count, plural, =1 {record} other {records}} and can now create them all.',
      headingAfterCorrection:
        'You have corrected all your errors and can now create {count} new waste movement {count, plural, =1 {record} other {records}}.',
      pageHeading:
        'Create {count} new waste movement {count, plural, =1 {record} other {records}}',
      warning:
        "You'll need to update all estimated details in your records with actual details as soon as possible after submitting",
      body: 'If you cancel creating these now, you will have to upload the CSV file again.',
      button: 'Continue and create records',
      cancelLink: 'Cancel',
    },
  },
};

jest.mock('./SubmitButton', () => {
  const SubmitButton = () => <div />;
  return { SubmitButton };
});
describe('Validation success component', () => {
  test('renders correctly when 1 submission which has estimates and previous wrong answers', async () => {
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <ValidationSuccess
          recordCount={1}
          hasEstimates={true}
          hasCorrectedErrors={true}
          pageUrl="any"
          submissionId="any"
          token="any"
        />
      </NextIntlClientProvider>,
    );

    expect(
      screen.getByText(
        'You have corrected all your errors and can now create 1 new waste movement record.',
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "You'll need to update all estimated details in your records with actual details as soon as possible after submitting",
      ),
    ).toBeInTheDocument();
  });

  test('renders correctly when 3 submissions and no previous wrong answers', async () => {
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <ValidationSuccess
          recordCount={3}
          hasEstimates={false}
          hasCorrectedErrors={false}
          pageUrl="any"
          submissionId="any"
          token="any"
        />
      </NextIntlClientProvider>,
    );

    expect(
      screen.getByText(
        'You have no errors in your 3 waste movement records and can now create them all.',
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Create 3 new waste movement records'),
    ).toBeInTheDocument();
  });
});
