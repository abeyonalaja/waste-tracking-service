import { render, screen } from '@testing-library/react';
import Index from '../../pages/dashboard/index';

describe('Index', () => {
  it('renders Green list waste overview page', () => {
    const { baseElement } = render(<Index />);
    expect(baseElement).toBeTruthy();
    expect(screen.findByText('Green list waste overview')).toBeTruthy();
  });
});
