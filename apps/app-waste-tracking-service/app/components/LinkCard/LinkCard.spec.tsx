import React from 'react';
import { render, screen } from '@testing-library/react';
import { LinkCard } from './LinkCard';
import { NextIntlClientProvider } from 'next-intl';

jest.mock('next/navigation', () => ({
  usePathname: () => '/',
  useRouter: () => ({
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    push: jest.fn(),
    prefetch: jest.fn(),
    replace: jest.fn(),
  }),
  useParams: () => ({ locale: 'en' }),
  useSelectedLayoutSegment: () => ({ locale: 'en' }),
}));

describe('LinkCard component', () => {
  test('renders with title, content, and href', () => {
    const props = {
      title: 'Test Title',
      content: 'Test Content',
      href: '/test-href',
    };
    render(
      <NextIntlClientProvider locale="en">
        <LinkCard {...props} />
      </NextIntlClientProvider>
    );

    expect(screen.getByText(props.title)).toBeDefined();
    expect(screen.getByText(props.content)).toBeDefined();

    const linkElement = screen.getByRole('link');
    expect(linkElement).toBeDefined();
    expect(linkElement.getAttribute('href')).toBe(props.href);
  });

  test('renders with default href when not provided', () => {
    const props = {
      title: 'Test Title',
      content: 'Test Content',
    };
    render(
      <NextIntlClientProvider locale="en">
        <LinkCard {...props} />
      </NextIntlClientProvider>
    );

    const linkElement = screen.getByRole('link');
    expect(linkElement.getAttribute('href')).toBe('#');
  });
});
