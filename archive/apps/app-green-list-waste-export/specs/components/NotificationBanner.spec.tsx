import React from 'react';
import { render, screen, act } from 'jest-utils';
import '@testing-library/jest-dom';
import { NotificationBanner } from '../../components';

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ data: {} }),
  } as Response),
);

describe('NotificationBanner', () => {
  test('renders important banner with custom heading', async () => {
    await act(async () => {
      render(
        <NotificationBanner type="important" headingText="Important Heading" />,
      );
    });

    const importantBanner = screen.getByText('Important');
    const heading = screen.getByText('Important Heading');

    expect(importantBanner).toBeInTheDocument();
    expect(heading).toBeInTheDocument();
  });

  test('renders success banner with custom heading', async () => {
    await act(async () => {
      render(
        <NotificationBanner type="success" headingText="Success Heading" />,
      );
    });

    const successBanner = screen.getByText('Success');
    const heading = screen.getByText('Success Heading');

    expect(successBanner).toBeInTheDocument();
    expect(heading).toBeInTheDocument();
  });
});
