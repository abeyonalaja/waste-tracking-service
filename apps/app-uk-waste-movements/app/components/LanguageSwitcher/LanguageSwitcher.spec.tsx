import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { LanguageSwitcher } from './LanguageSwitcher';
import { NextIntlClientProvider } from 'next-intl';
import userEvent from '@testing-library/user-event';

const mockPush = jest.fn();

jest.mock('next/navigation', () => ({
  usePathname: () => '/',
  useRouter: () => ({
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    push: mockPush,
    prefetch: jest.fn(),
    replace: jest.fn(),
  }),
  useParams: () => ({ locale: 'en' }),
  useSelectedLayoutSegment: () => ({ locale: 'en' }),
}));

describe('Language Switcher component', () => {
  it('Renders without errors', () => {
    render(
      <NextIntlClientProvider locale="en">
        <LanguageSwitcher />
      </NextIntlClientProvider>
    );
  });

  it('Renders within a nav element', () => {
    render(
      <NextIntlClientProvider locale="en">
        <LanguageSwitcher />
      </NextIntlClientProvider>
    );

    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('Has "cy" hrefLang attribute for Welsh link', () => {
    render(
      <NextIntlClientProvider locale="en">
        <LanguageSwitcher />
      </NextIntlClientProvider>
    );

    const welshLink = screen.getByRole('link', { name: /Cymraeg/i });
    expect(welshLink).toHaveAttribute('hrefLang', 'cy');
  });

  it('Has "en" hrefLang attribute for English link', () => {
    render(
      <NextIntlClientProvider locale="en">
        <LanguageSwitcher />
      </NextIntlClientProvider>
    );

    const englishLink = screen.getByRole('link', { name: /English/i });
    expect(englishLink).toHaveAttribute('hrefLang', 'en');
  });

  it('Calls push function when link is clicked', async () => {
    render(
      <NextIntlClientProvider locale="en">
        <LanguageSwitcher />
      </NextIntlClientProvider>
    );

    const englishLink = screen.getByRole('link', { name: /english/i });
    await userEvent.click(englishLink);

    expect(mockPush).toHaveBeenCalled();
  });
});
