import React from 'react';

import { render, screen } from '@testing-library/react';
import CompleteFooter from './CompleteFooter.tsx';

describe(CompleteFooter, () => {
  it('renders Footer component', () => {
    render('<CompleteFooter />');

    expect(screen.findByText('Accessibility statement')).toBeTruthy();
  });
});
