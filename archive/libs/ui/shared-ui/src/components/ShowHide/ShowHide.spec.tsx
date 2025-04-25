import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ShowHide } from './ShowHide';

describe('Show/Hide component', () => {
  it('renders the button and the children', () => {
    render(
      <ShowHide id="test-id">
        <div>Child content</div>
      </ShowHide>,
    );
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(screen.getByText('Child content')).toBeInTheDocument();
  });

  it('toggles the expanded state when button is clicked', () => {
    render(
      <ShowHide id="test-id">
        <div>Child content</div>
      </ShowHide>,
    );

    const button = screen.getByRole('button');
    const content = screen.getByText('Child content').parentElement;

    expect(button).toHaveAttribute('aria-expanded', 'false');

    fireEvent.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'true');
    expect(content).not.toHaveAttribute('hidden');

    fireEvent.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'false');
  });

  it('displays the correct text based on expanded state', () => {
    render(
      <ShowHide id="test-id">
        <div>Child content</div>
      </ShowHide>,
    );

    const button = screen.getByRole('button');
    const showText = 'Show all details';
    const hideText = 'Hide all details';

    expect(button).toHaveTextContent(showText);

    fireEvent.click(button);
    expect(button).toHaveTextContent(hideText);

    fireEvent.click(button);
    expect(button).toHaveTextContent(showText);
  });

  it('applies the correct chevron class based on expanded state', () => {
    render(
      <ShowHide id="test-id">
        <div>Child content</div>
      </ShowHide>,
    );

    const chevron = screen
      .getByRole('button')
      .querySelector('span.govuk-accordion-nav__chevron');

    expect(chevron).toHaveClass('govuk-accordion-nav__chevron--down');

    fireEvent.click(screen.getByRole('button'));
    expect(chevron).not.toHaveClass('govuk-accordion-nav__chevron--down');

    fireEvent.click(screen.getByRole('button'));
    expect(chevron).toHaveClass('govuk-accordion-nav__chevron--down');
  });
});
