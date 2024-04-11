import React from 'react';
import { render, screen, fireEvent } from 'jest-utils';
import '@testing-library/jest-dom';
import { CookieBanner } from 'components';

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ data: {} }),
  })
);

describe('Cookie Banner component', () => {
  it('renders correctly', () => {
    render(<CookieBanner />);

    const banner = screen.getByRole('region', {
      name: 'Cookies on Export waste from the UK',
    });

    expect(banner).toBeInTheDocument();

    const title = screen.getByText('Cookies on Export waste from the UK');
    expect(title).toBeInTheDocument();

    const acceptButton = screen.getByText('Accept analytics cookies');
    const rejectButton = screen.getByText('Reject analytics cookies');

    expect(acceptButton).toBeInTheDocument();
    expect(rejectButton).toBeInTheDocument();
  });

  it('show confirmation when accepted', () => {
    render(<CookieBanner />);

    const acceptButton = screen.getByText('Accept analytics cookies');
    fireEvent.click(acceptButton);

    const text = screen.getByText(/You have accepted analytics cookies/);
    expect(text).toBeInTheDocument();
  });
});
