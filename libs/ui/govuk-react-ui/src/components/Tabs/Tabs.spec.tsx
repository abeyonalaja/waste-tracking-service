import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Tabs } from './Tabs';
import { NextIntlClientProvider } from 'next-intl';

const labels = [
  {
    panelId: 'by-column',
    label: 'Errors by column',
  },
  {
    panelId: 'by-row',
    label: 'Errors by row',
  },
];

describe('Tabs component', () => {
  it('should render the tab labels', () => {
    render(
      <NextIntlClientProvider locale="en">
        <Tabs labels={labels}>
          <div>Panel 1</div>
          <div>Panel 2</div>
        </Tabs>
      </NextIntlClientProvider>,
    );
    expect(screen.getByText('Errors by column')).toBeInTheDocument();
    expect(screen.getByText('Errors by row')).toBeInTheDocument();
  });

  it('should display the first tab panel by default', () => {
    render(
      <NextIntlClientProvider locale="en">
        <Tabs labels={labels}>
          <div>Panel 1</div>
          <div>Panel 2</div>
        </Tabs>
      </NextIntlClientProvider>,
    );
    expect(screen.getByText('Panel 1')).toBeInTheDocument();
  });

  it('should have accessible links for each panel', () => {
    render(
      <NextIntlClientProvider locale="en">
        <Tabs labels={labels}>
          <div>Panel 1</div>
          <div>Panel 2</div>
        </Tabs>
      </NextIntlClientProvider>,
    );

    const byColumnTab = screen.getByRole('tab', { name: 'Errors by column' });

    expect(byColumnTab).toHaveAttribute('role', 'tab');
    expect(byColumnTab).toHaveAttribute('aria-controls', 'by-column');
    expect(byColumnTab).toHaveAttribute('aria-selected', 'true');
  });

  it('should change aria-selected when next tab is clicked', () => {
    render(
      <NextIntlClientProvider locale="en">
        <Tabs labels={labels}>
          <div>Panel 1</div>
          <div>Panel 2</div>
        </Tabs>
      </NextIntlClientProvider>,
    );

    const byColumnTab = screen.getByRole('tab', { name: 'Errors by column' });
    const byRowTab = screen.getByRole('tab', { name: 'Errors by row' });

    expect(byColumnTab).toHaveAttribute('aria-selected', 'true');

    act(() => {
      byRowTab.click();
    });

    expect(byRowTab).toHaveAttribute('aria-selected', 'true');
    expect(byColumnTab).toHaveAttribute('aria-selected', 'false');
  });
});
