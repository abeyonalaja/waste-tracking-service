import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { SummaryList } from './SummaryList';

describe('SummaryList component', () => {
  test('renders SummaryList component with no items', () => {
    render(<SummaryList testId="test-summary" items={[]} />);
    const listElement = screen.getByTestId('test-summary');
    expect(listElement).toBeInTheDocument();
    expect(listElement.childElementCount).toBe(0);
  });

  test('renders SummaryList component with items', () => {
    const items = [
      { key: 'Key 1', value: 'Value 1' },
      { key: 'Key 2', value: 'Value 2' },
    ];
    render(<SummaryList testId="test-summary" items={items} />);
    const listElement = screen.getByTestId('test-summary');
    expect(listElement).toBeInTheDocument();
    expect(listElement.childElementCount).toBe(items.length);
    for (const item of items) {
      expect(screen.getByText(item.key)).toBeInTheDocument();
      expect(screen.getByText(item.value)).toBeInTheDocument();
    }
  });
});
