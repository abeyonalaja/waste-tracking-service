import { render, screen } from '@testing-library/react';
import { Details } from './Details';
import { NextIntlClientProvider } from 'next-intl';
import '@testing-library/jest-dom';

const messages = {
  multiples: {
    guidancePage: {
      details: {
        heading: 'Details',
        content:
          'Use this CSV template and guidance if you want to submit multiple waste movements at the same time to the. This is instead of submitting one waste movement record at a time.',
        listInfo: 'It’s important the information you enter is:',
        listItemOne: 'accurate',
        listItemTwo: 'spelt correctly',
        listItemThree: 'formatted correctly',
        outro: 'Make sure you check for errors before you upload your file.',
        multiple: {
          heading: 'Multiple waste movements CSV template',
          contentOne:
            'You need to fill in the CSV template with information you would usually provide when you complete a waste movement record.',
          contentTwo:
            'The template is designed so that it is accessible for most users and is compatible with as many programs as possible. For example, it does not include colours, freeze panes or pre-populated dropdowns, as these features do not work on all systems. ',
        },
        technicalIssue: {
          heading: 'Get help with technical issues',
          contentOne:
            'You can contact the waste tracking service support team if you need help with a technical issue, such as: ',
          listItemOne:
            'problems with uploading waste movement details using a CSV file',
          listItemTwo: 'any other technical service-related query',
          contentTwo:
            'You can contact the waste tracking service support team by emailing ',
          email: '[EMAIL ADDRESS HERE]',
        },
        regulatoryIssue: {
          heading: 'Get help with regulatory issues',
          contentOne:
            'The waste tracking service support team will not be able to answer regulatory questions. You should contact your relevant regulatory team instead.',
          contentTwo:
            'Your national regulatory team will not be able to answer technical questions about service problems.',
        },
      },
    },
  },
};
test('renders Content component', () => {
  render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <Details />
    </NextIntlClientProvider>,
  );
  expect(screen.getByText('Details')).toBeInTheDocument();
});
