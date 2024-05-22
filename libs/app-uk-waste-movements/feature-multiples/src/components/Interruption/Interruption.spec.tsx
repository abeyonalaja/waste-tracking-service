import { render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import '@testing-library/jest-dom';
import type { Session } from 'next-auth';
import { Interruption } from './Interruption';

const mockedSession: Session | null = null;
jest.mock('next-auth/next', () => ({
  getServerSession: jest.fn(() => Promise.resolve(mockedSession)),
}));

jest.mock('@wts/ui/navigation', () => ({
  ...jest.requireActual('@wts/ui/navigation'),
  useRouter: (): jest.Mock => jest.fn(),
}));

const messages = {
  multiples: {
    interruption: {
      heading:
        'Use the guidance to create multiple new waste movements using a CSV template',
      paragraphOne:
        'When you enter your waste movement information into the template, you need to save it as a CSV file. This is where data is separated by commas rather than columns. If you change the structure of the template, your upload may fail.',
      paragraphTwo:
        'It is important you use the guidance to help you fill in and upload the template correctly.',
      link: 'How to create multiple new waste movements using the CSV template (opens in new tab)',
      button: 'Continue',
    },
  },
};

describe('Interruption component', () => {
  it('renders without error', () => {
    render(
      <NextIntlClientProvider messages={messages} locale="en">
        <Interruption />
      </NextIntlClientProvider>
    );
  });

  it('Has an H1 heading', () => {
    render(
      <NextIntlClientProvider messages={messages} locale="en">
        <Interruption />
      </NextIntlClientProvider>
    );

    const heading = screen.getByRole('heading', { level: 1 });

    expect(heading).toBeInTheDocument();
  });

  it('Has a link to the guidance', () => {
    render(
      <NextIntlClientProvider messages={messages} locale="en">
        <Interruption />
      </NextIntlClientProvider>
    );

    const link = screen.getByRole('link', {
      name: 'How to create multiple new waste movements using the CSV template (opens in new tab)',
    });

    expect(link).toHaveAttribute('href', '/en/multiples/guidance');
  });

  it('Has a continue button', () => {
    render(
      <NextIntlClientProvider messages={messages} locale="en">
        <Interruption />
      </NextIntlClientProvider>
    );

    const continueButton = screen.getByRole('button', { name: 'Continue' });

    expect(continueButton).toBeInTheDocument();
  });
});
