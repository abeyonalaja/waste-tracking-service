import { render, screen } from '@testing-library/react';
import CompleteFooter from '../components/CompleteFooter';

describe(CompleteFooter, () => {
  it('renders Footer component', () => {
    render('<CompleteFooter />');

    expect(screen.findByText('Accessibility statement')).toBeTruthy();
  });
});
