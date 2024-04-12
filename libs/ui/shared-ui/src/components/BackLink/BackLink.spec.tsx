import React from 'react';
import { render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { BackLink } from './BackLink';

describe('Back Link component', () => {
  test('renders with text and testId', () => {
    const testText = 'Click me';
    const testId = 'customTestId';
    render(
      <NextIntlClientProvider messages={{}} locale="en">
        <BackLink text={testText} testId={testId} href="test" />
      </NextIntlClientProvider>
    );
    const buttonElement = screen.getByText(testText);
    expect(buttonElement).toBeTruthy();
  });
});
