import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import type { Session } from 'next-auth';
import { TotalErrorSummary } from './TotalErrorSummary';
import { NextIntlClientProvider } from 'next-intl';

const mockedSession: Session | null = null;
jest.mock('next-auth/next', () => ({
  getServerSession: jest.fn(() => Promise.resolve(mockedSession)),
}));

jest.mock('@wts/ui/navigation', () => ({
  ...jest.requireActual('@wts/ui/navigation'),
  useRouter: () => {
    return {
      replace: jest.fn(),
    };
  },
}));

const strings = {
  heading: 'You have a total of 56 errors',
  prompt:
    'You need to correct these errors before you can create all your new waste movement records',
  linkText: 'Error summary',
};

describe('Total Error Summary component', () => {
  it('Displays the header error', () => {
    render(
      <NextIntlClientProvider locale="en">
        <TotalErrorSummary strings={strings} href={'file-upload'} />
      </NextIntlClientProvider>
    );

    const heading = screen.getByRole('heading', {
      level: 2,
      name: strings.heading,
    });
    expect(heading).toBeInTheDocument();
  });

  it('Displays text informing user they need to correct errors', () => {
    render(
      <NextIntlClientProvider locale="en">
        <TotalErrorSummary strings={strings} href={'file-upload'} />
      </NextIntlClientProvider>
    );

    const correctionText = screen.getByText(strings.prompt);
    expect(correctionText).toBeInTheDocument();
  });

  it('Displays a link for the user to jump to the error tabs', () => {
    render(
      <NextIntlClientProvider locale="en">
        <TotalErrorSummary strings={strings} href={'error-tabs'} />
      </NextIntlClientProvider>
    );

    const link = screen.getByRole('link', { name: 'Error summary' });
    expect(link).toHaveAttribute('href', '/en#');
  });
});
