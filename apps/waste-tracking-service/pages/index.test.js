import { render, screen } from '@testing-library/react';
import Index from './index';

test('renders the landing page', () => {
  render(<Index />);

  expect(screen.getByRole("a")).toHaveTextContent("Waste tracking service");
  
});