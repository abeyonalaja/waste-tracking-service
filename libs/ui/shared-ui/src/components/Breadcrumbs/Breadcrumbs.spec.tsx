import React from 'react';
import { render } from '@testing-library/react';
import { Breadcrumbs } from './Breadcrumbs';
import { NextIntlClientProvider } from 'next-intl';

describe('Breadcrumbs', () => {
  const items = [
    { text: 'Home', href: '/home' },
    { text: 'Page 1', href: '/page1' },
    { text: 'Page 2' },
  ];

  it('renders all breadcrumb items correctly', () => {
    const { getByText } = render(
      <NextIntlClientProvider locale="en">
        <Breadcrumbs items={items} />
      </NextIntlClientProvider>
    );

    expect(getByText('Home')).toBeTruthy();
    expect(getByText('Page 1')).toBeTruthy();
    expect(getByText('Page 2')).toBeTruthy();
  });

  it('adds aria-current="page" to the last breadcrumb without href', () => {
    const { getByText } = render(
      <NextIntlClientProvider locale="en">
        <Breadcrumbs items={items} />
      </NextIntlClientProvider>
    );

    const lastBreadcrumb = getByText('Page 2');
    expect(lastBreadcrumb.getAttribute('aria-current')).toBe('page');
  });

  it('renders links correctly with href attribute', () => {
    const { getByText } = render(
      <NextIntlClientProvider locale="en">
        <Breadcrumbs items={items} />
      </NextIntlClientProvider>
    );

    const homeLink = getByText('Home');
    const page1Link = getByText('Page 1');

    expect(homeLink).toBeTruthy();

    expect(homeLink.getAttribute('href')).toBe('/en/home');
    expect(page1Link.getAttribute('href')).toBe('/en/page1');
  });

  it('sets custom testId prop', () => {
    const testId = 'breadcrumbs-test';
    const { getByTestId } = render(
      <NextIntlClientProvider locale="en">
        <Breadcrumbs items={items} testId={testId} />
      </NextIntlClientProvider>
    );

    const breadcrumbs = getByTestId(testId);
    expect(breadcrumbs).toBeTruthy();
  });
});
