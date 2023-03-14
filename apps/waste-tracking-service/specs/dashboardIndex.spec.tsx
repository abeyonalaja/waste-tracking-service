import { render, screen } from '@testing-library/react';
import Index from '../pages/dashboard/index';

describe(Index, () => {
  it('renders Green list waste overview page', () => {
    render('<Index />');

    expect(screen.findByText('Green list waste overview')).toBeTruthy();
  });
});
