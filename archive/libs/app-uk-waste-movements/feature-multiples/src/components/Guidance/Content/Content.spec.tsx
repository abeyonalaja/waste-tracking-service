import { render, screen } from '@testing-library/react';
import { Content } from './Content';
import { NextIntlClientProvider } from 'next-intl';
import '@testing-library/jest-dom';

const messages = {
  multiples: {
    guidancePage: {
      heading:
        'Waste movements in the UK: how to create multiple waste movements using a CSV file',
      hint: 'Use this guidance to help you complete a CSV template to upload multiple waste movements for the ‘Move waste in the UK’ service.',
      content: {
        linkOne: 'Details',
        linkTwo: 'Your unique reference',
        linkThree: 'Producer and collection details',
        linkFour: 'Collection details',
        linkFive: 'Receiver details',
        linkSix: 'European Waste Catalogue (EWC) codes and description ',
      },
      documents: {
        heading: 'Documents',
        linkOne: 'Multiple waste movements CSV template',
      },
    },
  },
};
test('renders Content component', () => {
  render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <Content />
    </NextIntlClientProvider>,
  );
  expect(screen.getByText('Details')).toBeInTheDocument();
});
