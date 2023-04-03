import React from 'react';
import { render, screen } from '@testing-library/react';
import SubmitAnExport from '../../pages/dashboard/submit-an-export';
import '@testing-library/jest-dom/extend-expect';
import '@testing-library/jest-dom';

jest.mock('next/router', () => require('next-router-mock'));

describe('Index', () => {
  it('renders Submit and export page', () => {
    const { baseElement } = render(<SubmitAnExport />);
    expect(baseElement).toBeTruthy();
    expect(screen.findByText('Submit an export')).toBeTruthy();
  });
});
