import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { ErrorInstructions } from './ErrorInstructions';
import { NextIntlClientProvider } from 'next-intl';

const messages = {
  multiples: {
    errors: {
      instructions: {
        paragraphOne:
          'You need to correct all errors in your file and upload it again. This will replace your previous upload',
        paragraphTwoOne: 'Review the guidance on ',
        linkText:
          'how to create multiple new waste movements using the CSV template (opens in new tab)',
        paragraphTwoTwo: ' to understand how to fill it in',
      },
    },
  },
};

describe('ErrorInstructions component', () => {
  it('displays a link to the guidance page', () => {
    render(
      <NextIntlClientProvider messages={messages} locale="en">
        <ErrorInstructions />
      </NextIntlClientProvider>,
    );

    const guidanceLink = screen.getByRole('link');

    expect(guidanceLink).toHaveAttribute('href', '/en/multiples/guidance');
  });

  it('displays a link to the guidance page which opens in new tab', () => {
    render(
      <NextIntlClientProvider messages={messages} locale="en">
        <ErrorInstructions />
      </NextIntlClientProvider>,
    );

    const guidanceLink = screen.getByRole('link');

    expect(guidanceLink).toHaveAttribute('target', '_blank');
  });
});
