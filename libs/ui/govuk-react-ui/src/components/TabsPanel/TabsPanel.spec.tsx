import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TabsPanel } from './TabsPanel';
import { NextIntlClientProvider } from 'next-intl';
import React from 'react';

describe('TabsPanel component', () => {
  it('renders without errors', () => {
    render(
      <NextIntlClientProvider locale="en">
        <TabsPanel id="test">
          <div>Mock child</div>
        </TabsPanel>
      </NextIntlClientProvider>
    );
  });

  it('Does not have the hidden GDS class name when active', () => {
    const useTabContext = jest.spyOn(React, 'useContext');
    useTabContext.mockImplementation(() => ({
      activeTab: 'test',
    }));

    render(
      <NextIntlClientProvider locale="en">
        <TabsPanel id="test">
          <div>Mock child</div>
        </TabsPanel>
      </NextIntlClientProvider>
    );

    const panel = screen.getByText('Mock child').parentElement;

    expect(panel).toHaveClass('govuk-tabs__panel');

    useTabContext.mockRestore();
  });

  it('Has the hidden GDS class name when not active', () => {
    const useTabContext = jest.spyOn(React, 'useContext');
    useTabContext.mockImplementation(() => ({
      activeTab: 'not-test',
    }));

    render(
      <NextIntlClientProvider locale="en">
        <TabsPanel id="test">
          <div>Mock child</div>
        </TabsPanel>
      </NextIntlClientProvider>
    );

    const panel = screen.getByText('Mock child').parentElement;

    expect(panel).toHaveClass('govuk-tabs__panel--hidden');

    useTabContext.mockRestore();
  });
});
