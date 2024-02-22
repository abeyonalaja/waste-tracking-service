import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { SummaryCard } from './SummaryCard'; // adjust the path as needed

describe('SummaryCard', () => {
  it('displays the title', () => {
    render(<SummaryCard title="Test Title" />);
    const title = screen.getByRole('heading', { name: /Test Title/i });
    expect(title).toBeInTheDocument();
  });

  it('displays the children', () => {
    render(<SummaryCard>Test Children</SummaryCard>);
    const children = screen.getByText(/Test Children/i);
    expect(children).toBeInTheDocument();
  });

  it('has the correct data-testId', () => {
    render(<SummaryCard testId="testId">Test Children</SummaryCard>);
    const card = screen.getByTestId('testId');
    expect(card).toBeInTheDocument();
  });
});
