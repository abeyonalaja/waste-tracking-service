import React from 'react';
import { render, screen } from '@testing-library/react';
import { LinkCard } from './LinkCard';

describe('LinkCard component', () => {
  test('renders with title, content, and href', () => {
    const props = {
      title: 'Test Title',
      content: 'Test Content',
      href: '/test-href',
    };
    render(<LinkCard {...props} />);

    expect(screen.getByText(props.title)).toBeDefined();
    expect(screen.getByText(props.content)).toBeDefined();

    const linkElement = screen.getByRole('link');
    expect(linkElement).toBeDefined();
    expect(linkElement.getAttribute('href')).toBe(props.href);
  });

  test('renders with default href when not provided', () => {
    const props = {
      title: 'Test Title',
      content: 'Test Content',
    };
    render(<LinkCard {...props} />);

    const linkElement = screen.getByRole('link');
    expect(linkElement.getAttribute('href')).toBe('#');
  });
});
