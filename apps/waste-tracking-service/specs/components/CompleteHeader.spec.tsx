import { render, screen } from '@testing-library/react';
import CompleteHeader from '../components/CompleteHeader';

describe('CompleteHeader', () => {
  it('renders Header component', () => {
    const { baseElement } = render(<CompleteHeader />);
    expect(baseElement).toBeTruthy();
    expect(screen.findByText('Green list waste overview')).toBeTruthy();
  });
});
