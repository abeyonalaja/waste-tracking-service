import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AccordionSection } from './AccordionSection';

describe('AccordionSection component', () => {
  let sections;
  let toggle;

  beforeEach(() => {
    sections = {
      section1: false,
    };
    toggle = jest.fn((id) => {
      sections[id] = !sections[id];
    });
  });

  it('renders the section with title and summary', () => {
    render(
      <AccordionSection
        id="section1"
        title="Section Title"
        summary="Section Summary"
        sections={sections}
        toggle={toggle}
      >
        <div>Child Content</div>
      </AccordionSection>,
    );

    expect(screen.getByText('Section Title')).toBeInTheDocument();
    expect(screen.getByText('Section Summary')).toBeInTheDocument();
    expect(screen.getByText('Child Content')).toBeInTheDocument();
  });

  it('toggles the expanded state when button is clicked', () => {
    render(
      <AccordionSection
        id="section1"
        title="Section Title"
        summary="Section Summary"
        sections={sections}
        toggle={toggle}
      >
        <div>Child Content</div>
      </AccordionSection>,
    );

    const button = screen.getByRole('button');

    expect(button).toHaveAttribute('aria-expanded', 'false');
    expect(screen.getByText('Show')).toBeInTheDocument();

    fireEvent.click(button);
    expect(toggle).toHaveBeenCalledWith('section1');
  });

  it('applies the correct chevron class based on expanded state', () => {
    render(
      <AccordionSection
        id="section1"
        title="Section Title"
        summary="Section Summary"
        sections={sections}
        toggle={toggle}
      >
        <div>Child Content</div>
      </AccordionSection>,
    );

    const chevron = screen
      .getByRole('button')
      .querySelector('span.govuk-accordion-nav__chevron');

    expect(chevron).toHaveClass('govuk-accordion-nav__chevron--down');

    fireEvent.click(screen.getByRole('button'));
    expect(toggle).toHaveBeenCalledWith('section1');
  });

  it('displays the status tag if provided', () => {
    render(
      <AccordionSection
        id="section1"
        title="Section Title"
        summary="Section Summary"
        sections={sections}
        toggle={toggle}
        status="Complete"
      >
        <div>Child Content</div>
      </AccordionSection>,
    );

    expect(screen.getByText('Complete')).toBeInTheDocument();
  });

  it('has an id on the show/hide-all-button', () => {
    render(
      <AccordionSection
        id="section1"
        title="Section Title"
        summary="Section Summary"
        sections={sections}
        toggle={toggle}
      >
        <div>Child Content</div>
      </AccordionSection>,
    );

    expect(screen.getByRole('button')).toHaveAttribute(
      'id',
      'show-hide-button-section1',
    );
  });
});
