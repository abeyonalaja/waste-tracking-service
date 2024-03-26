import { render, screen } from '@testing-library/react';
import { Footer } from 'components';

describe('CompleteFooter', () => {
  it('renders Footer component', () => {
    const { baseElement } = render(<Footer />);
    expect(baseElement).toBeTruthy();
    expect(screen.findByText('Accessibility statement')).toBeTruthy();
  });
});
