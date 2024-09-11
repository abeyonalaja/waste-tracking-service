import React from 'react';
import { render, screen, act, waitFor } from 'jest-utils';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { CookieBanner } from 'components';

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ data: {} }),
  } as Response),
);

const mockSetCookie = jest.fn();
jest.mock('react-cookie', () => ({
  useCookies: () => [[], mockSetCookie],
}));

describe('Cookie Banner component', () => {
  it('renders correctly', async () => {
    await act(async () => {
      render(<CookieBanner />);
    });

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

  it('Calls setCookie when accept button is clicked', async () => {
    const user = userEvent.setup();

    await act(async () => {
      render(<CookieBanner />);
    });

    const acceptButton = screen.getByText('Accept analytics cookies');
    expect(acceptButton).toBeInTheDocument();

    await user.click(acceptButton);

    await waitFor(() => {
      expect(mockSetCookie).toHaveBeenCalled();
    });
  });
});
