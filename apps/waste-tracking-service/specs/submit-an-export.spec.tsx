import React from 'react';
import { render, screen } from '@testing-library/react';
import Tasklist from '../pages/submit-an-export-tasklist';
import '@testing-library/jest-dom/extend-expect';
import '@testing-library/jest-dom';

jest.mock('next/router', () => ({
  useRouter: jest.fn(() => ({
    isReady: true,
    query: { id: '123' },
  })),
}));

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ data: {} }),
  })
);

describe('Submit an export', () => {
  it('renders Submit an export page', () => {
    const { baseElement } = render(<Tasklist />);
    expect(baseElement).toBeTruthy();
    expect(screen.findByText('Submit an export')).toBeTruthy();
  });
});
