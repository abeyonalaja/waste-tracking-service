import React from 'react';
import { render } from 'jest-utils';
import '@testing-library/jest-dom';
import { NotificationBanner } from '../../components';

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ data: {} }),
  }),
);

describe('NotificationBanner', () => {
  test('renders important banner with custom heading', () => {
    const { getByText } = render(
      <NotificationBanner type="important" headingText="Important Heading" />,
    );

    const importantBanner = getByText('Important');
    const heading = getByText('Important Heading');

    expect(importantBanner).toBeInTheDocument();
    expect(heading).toBeInTheDocument();
  });

  test('renders success banner with custom heading', () => {
    const { getByText } = render(
      <NotificationBanner type="success" headingText="Success Heading" />,
    );

    const successBanner = getByText('Success');
    const heading = getByText('Success Heading');

    expect(successBanner).toBeInTheDocument();
    expect(heading).toBeInTheDocument();
  });
});
