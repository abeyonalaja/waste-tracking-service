import { render, screen } from '@testing-library/react';
import { DashboardCard } from './DashboardCard';
import { NextIntlClientProvider } from 'next-intl';
import '@testing-library/jest-dom';
import React from 'react';

const messages = {
  moveWastePage: {
    cardTitle: 'Create new waste movements',
    cardParagraphOne: 'Create multiple waste movement',
    cardTitleTwo: 'Multiple waste movements',
    cardLink: 'Create a new multiple waste movement',
  },
};

describe('DashboardCard', () => {
  it('renders the card with correct translations', () => {
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <DashboardCard />
      </NextIntlClientProvider>,
    );

    expect(screen.getByText('Create new waste movements')).toBeInTheDocument();
  });
  it('renders the link with correct href', () => {
    render(
      <NextIntlClientProvider messages={messages} locale="en">
        <DashboardCard />
      </NextIntlClientProvider>,
    );
    const templateLink = screen.getByRole('link', {
      name: 'Create a new multiple waste movement',
    });
    expect(templateLink).toHaveAttribute('href', '/en/multiples');
  });
});
