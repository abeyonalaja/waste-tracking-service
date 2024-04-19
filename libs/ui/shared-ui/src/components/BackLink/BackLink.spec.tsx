import React from 'react';
import { render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { BackLink } from './BackLink';
import {
  AppRouterContext,
  AppRouterInstance,
} from 'next/dist/shared/lib/app-router-context.shared-runtime';

export type AppRouterContextProviderMockProps = {
  router: Partial<AppRouterInstance>;
  children: React.ReactNode;
};

export const AppRouterContextProviderMock = ({
  router,
  children,
}: AppRouterContextProviderMockProps): React.ReactNode => {
  const mockedRouter: AppRouterInstance = {
    back: jest.fn(),
    forward: jest.fn(),
    push: jest.fn(),
    replace: jest.fn(),
    refresh: jest.fn(),
    prefetch: jest.fn(),
    ...router,
  };
  return (
    <AppRouterContext.Provider value={mockedRouter}>
      {children}
    </AppRouterContext.Provider>
  );
};
describe('Back Link component', () => {
  test('renders with text and testId', () => {
    const testText = 'Click me';
    const testId = 'customTestId';
    const push = jest.fn(); // Initialize the 'push' property
    render(
      <AppRouterContextProviderMock router={{ push }}>
        <NextIntlClientProvider messages={{}} locale="en">
          <BackLink text={testText} testId={testId} href="test" />
        </NextIntlClientProvider>
      </AppRouterContextProviderMock>
    );
    const buttonElement = screen.getByText(testText);
    expect(buttonElement).toBeTruthy();
  });
});
