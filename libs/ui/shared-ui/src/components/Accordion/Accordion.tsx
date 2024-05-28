'use client';

import { Dispatch, SetStateAction } from 'react';

interface AccordionProps {
  id: string;
  sections: Record<string, boolean>;
  setSections: Dispatch<SetStateAction<{ [key: string]: boolean }>>;
  children: React.ReactNode;
}

export function Accordion({
  id,
  sections,
  setSections,
  children,
}: AccordionProps): React.ReactNode {
  const allSectionsExpanded = Object.values(sections).every(
    (section) => section
  );

  function toggleAllSections() {
    const updatedSections: { [key: string]: boolean } = {};
    for (const section in sections) {
      updatedSections[section] = !allSectionsExpanded;
    }
    setSections(updatedSections);
  }

  return (
    <div id={id} className="govuk-accordion" data-module="govuk-accordion">
      <div className="govuk-accordian__controls">
        <button
          type="button"
          className="govuk-accordion__show-all"
          aria-expanded={allSectionsExpanded}
          onClick={toggleAllSections}
        >
          <span
            className={`govuk-accordion-nav__chevron ${
              !allSectionsExpanded && 'govuk-accordion-nav__chevron--down'
            }`}
          />
          <span className="govuk-accordion__show-all-text">
            {allSectionsExpanded ? 'Hide' : 'Show'} all sections
          </span>
        </button>
      </div>
      {children}
    </div>
  );
}
