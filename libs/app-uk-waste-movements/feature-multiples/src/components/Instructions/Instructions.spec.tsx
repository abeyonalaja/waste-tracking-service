import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { Instructions } from './Instructions';
import { NextIntlClientProvider } from 'next-intl';
import type { Session } from 'next-auth';

const mockedSession: Session | null = null;
jest.mock('next-auth/next', () => ({
  getServerSession: jest.fn(() => Promise.resolve(mockedSession)),
}));

const messages = {
  multiples: {
    uploadPage: {
      title: 'Creating multiple waste movements',
    },
    instructions: {
      createAndUpload: {
        heading: 'How to create and upload your file ',
        listItemOnePartOne: 'Use the guidance on ',
        listItemOneLink:
          'how to create multiple new waste movements using the CSV template (opens in new tab)',
        listItemOnePartTwo: ' to help you create your file.',
        listItemTwoPartOne: 'Download the ',
        listItemTwoLink: 'multiple new waste movements CSV template',
        listItemTwoPartTwo:
          ' and open it using spreadsheet software. For example, Excel, Numbers, OpenOffice Calc or Google Sheets.',
        listItemThree: 'Enter all the required information into the template.',
        listItemFour: 'Save the file in CSV format.',
        listItemFive: 'Upload the completed CSV file.',
      },
      documents: {
        heading: 'Documents',
        linkOne:
          'How to create multiple new waste movements using the CSV template (opens in new tab)',
        templateHeading: 'Multiple new waste movements CSV template',
        templateDescription:
          'This file may not be suitable for users of assistive technology.',
        templateLink:
          'Download the multiple new waste movements CSV template (3Kb)',
      },
    },
    uploadForm: {
      heading: 'Upload your CSV file',
      hint: 'You need to review and check for errors before uploading',
      button: 'Upload',
    },
  },
};

describe('Instructions component', () => {
  test('renders instructions', () => {
    render(
      <NextIntlClientProvider messages={messages} locale="en">
        <Instructions />
      </NextIntlClientProvider>,
    );
  });

  test('contains an in-line link to the guidance page', () => {
    render(
      <NextIntlClientProvider messages={messages} locale="en">
        <Instructions />
      </NextIntlClientProvider>,
    );

    const guidanceLink = screen.getByRole('link', {
      name: 'how to create multiple new waste movements using the CSV template (opens in new tab)',
    });

    expect(guidanceLink).toHaveAttribute('href', '/multiples/guidance');
  });

  test('contains a bulletpointed link to the guidance page', () => {
    render(
      <NextIntlClientProvider messages={messages} locale="en">
        <Instructions />
      </NextIntlClientProvider>,
    );

    const guidanceLink = screen.getByRole('link', {
      name: 'How to create multiple new waste movements using the CSV template (opens in new tab)',
    });

    expect(guidanceLink).toHaveAttribute('href', '/multiples/guidance');
  });

  test('contains an in-line link to the template download', () => {
    render(
      <NextIntlClientProvider messages={messages} locale="en">
        <Instructions />
      </NextIntlClientProvider>,
    );

    const templateLink = screen.getByRole('link', {
      name: 'multiple new waste movements CSV template',
    });

    expect(templateLink).toHaveAttribute(
      'href',
      '/downloads/multiple-movements-template.csv',
    );
  });

  test('contains a bullet pointed link to the template download', () => {
    render(
      <NextIntlClientProvider messages={messages} locale="en">
        <Instructions />
      </NextIntlClientProvider>,
    );

    const templateLink = screen.getByRole('link', {
      name: 'Download the multiple new waste movements CSV template (3Kb)',
    });

    expect(templateLink).toHaveAttribute(
      'href',
      '/downloads/multiple-movements-template.csv',
    );
  });
});
