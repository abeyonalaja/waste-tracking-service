import { render, screen } from '@testing-library/react';
import { CompleteFooter } from '../../components/';

describe('CompleteFooter', () => {
  it('renders Footer component', () => {
    const { baseElement } = render(<CompleteFooter />);
    expect(baseElement).toBeTruthy();
    expect(screen.findByText('Accessibility statement')).toBeTruthy();
  });
});
