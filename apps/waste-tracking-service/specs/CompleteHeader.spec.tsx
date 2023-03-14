import { render, screen } from '@testing-library/react';
import CompleteHeader from '../components/CompleteHeader';

describe(CompleteHeader, () => {
  it('renders Header component', () => {
    render('<CompleteHeader />');

    expect(screen.findByText('Green list waste overview')).toBeTruthy();
  });
});
