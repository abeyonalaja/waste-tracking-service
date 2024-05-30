import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Accordion } from './Accordion';

describe('Accordion component', () => {
  let sections;
  let setSections;

  beforeEach(() => {
    sections = {
      section1: false,
      section2: false,
      section3: false,
    };
    setSections = jest.fn((updatedSections) => {
      sections = { ...sections, ...updatedSections };
    });
  });

  it('renders the button and children', () => {
    render(
      <Accordion id="test-id" sections={sections} setSections={setSections}>
        <div>Child Content</div>
      </Accordion>,
    );

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(screen.getByText('Child Content')).toBeInTheDocument();
  });

  it('toggles all sections when button is clicked and has the correct aria state based on section being hidden', async () => {
    render(
      <Accordion id="test-id" sections={sections} setSections={setSections}>
        <div>Child Content</div>
      </Accordion>,
    );

    const button = screen.getByRole('button');
    const showText = 'Show all sections';

    expect(button).toHaveAttribute('aria-expanded', 'false');
    expect(button).toHaveTextContent(showText);

    await act(() => {
      fireEvent.click(button);
    });

    expect(setSections).toHaveBeenCalledWith({
      section1: true,
      section2: true,
      section3: true,
    });
  });

  it('toggles all sections when button is clicked and has the correct aria state based on section being shown', async () => {
    sections = { section1: true, section2: true, section3: true };
    render(
      <Accordion id="test-id" sections={sections} setSections={setSections}>
        <div>Child Content</div>
      </Accordion>,
    );
    const hideText = 'Hide all sections';
    const button = screen.getByRole('button');

    expect(button).toHaveAttribute('aria-expanded', 'true');
    expect(button).toHaveTextContent(hideText);

    fireEvent.click(button);
    expect(setSections).toHaveBeenCalledWith({
      section1: false,
      section2: false,
      section3: false,
    });
  });

  it('applies the correct chevron class based on sections state', () => {
    render(
      <Accordion id="test-id" sections={sections} setSections={setSections}>
        <div>Child Content</div>
      </Accordion>,
    );

    const chevron = screen
      .getByRole('button')
      .querySelector('span.govuk-accordion-nav__chevron');

    expect(chevron).toHaveClass('govuk-accordion-nav__chevron--down');

    fireEvent.click(screen.getByRole('button'));
    expect(setSections).toHaveBeenCalledWith({
      section1: true,
      section2: true,
      section3: true,
    });
  });
});
