import { render, screen } from '@testing-library/react';
import { NewWasteMovementsCard } from './NewWasteMovementsCard';
import { NextIntlClientProvider } from 'next-intl';
import '@testing-library/jest-dom';

const messages = {
  homePage: {
    newWasteMovements: {
      title: 'New waste movements',
      description:
        'Create a single waste movement, upload a CSV file of multiple movements, or continue a draft waste movement.',
      singleMovementTitle: 'Single waste movement',
      singleMovementLink: 'Create a new waste movement',
      multipleMovementTitle: 'Multiple waste movements',
      multipleMovementLink: 'Create multiple new waste movements',
      allMovementsTitle: 'All waste movements',
      allMovementsLinkAbsent: 'There are no created waste movements yet.',
    },
  },
};

describe('DashboardCard', () => {
  it('renders with the correct heading', () => {
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <NewWasteMovementsCard />
      </NextIntlClientProvider>,
    );

    const title = screen.getByRole('heading', { level: 2 });

    expect(title).toHaveTextContent('New waste movements');
  });

  it('renders with a section for single movements', () => {
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <NewWasteMovementsCard />
      </NextIntlClientProvider>,
    );

    const singleMovementSectionHeading = screen.getByRole('heading', {
      name: 'Single waste movement',
    });

    const singleMovementSectionLink = screen.getByRole('link', {
      name: 'Create a new waste movement',
    });

    expect(singleMovementSectionHeading).toBeInTheDocument();
    expect(singleMovementSectionLink).toHaveAttribute('href', '/single');
  });

  it('renders with a section for multiple movements', () => {
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <NewWasteMovementsCard />
      </NextIntlClientProvider>,
    );

    const multipleMovementSectionHeading = screen.getByRole('heading', {
      name: 'Multiple waste movements',
    });

    const multipleMovementSectionLink = screen.getByRole('link', {
      name: 'Create multiple new waste movements',
    });

    expect(multipleMovementSectionHeading).toBeInTheDocument();
    expect(multipleMovementSectionLink).toHaveAttribute('href', '/multiples');
  });

  it('renders with a section for all movements', () => {
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <NewWasteMovementsCard />
      </NextIntlClientProvider>,
    );

    const allMovementsSectionHeading = screen.getByRole('heading', {
      name: 'All waste movements',
    });

    const allMovementsSectionParagraph = screen.getByText(
      'There are no created waste movements yet.',
    );

    expect(allMovementsSectionHeading).toBeInTheDocument();
    expect(allMovementsSectionParagraph).toBeInTheDocument();
  });
});
