import React from 'react';
import { render, screen } from '@testing-library/react';
import Index from '../pages/index';

describe('Index', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Index />);
    expect(baseElement).toBeTruthy();
    expect(screen.findByText('Green list waste overview')).toBeTruthy();
  });
});
