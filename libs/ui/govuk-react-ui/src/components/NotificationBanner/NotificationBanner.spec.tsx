import React from 'react';
import { render, screen } from '@testing-library/react';
import { NotificationBanner } from './NotificationBanner';

describe('Notification Banner component', () => {
  test('renders with testId', () => {
    const testId = 'testId';
    render(<NotificationBanner testId={testId} title="Important" />);
    const element = screen.getByTestId(testId);
    expect(element).toBeTruthy();
  });

  test('renders with children and testId', () => {
    const testChildren = <span>Child element</span>;
    const testId = 'testId';
    render(
      <NotificationBanner
        children={testChildren}
        testId={testId}
        title="Important"
      />,
    );
    const textElement = screen.getByText('Child element');
    expect(textElement).toBeTruthy();
  });
});
