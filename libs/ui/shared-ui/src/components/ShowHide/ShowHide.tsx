'use client';

import React, { useState } from 'react';

interface ShowHideProps {
  id: string;
  children: React.ReactNode;
}

export function ShowHide({ id, children }: ShowHideProps): React.ReactElement {
  const [expanded, setExpanded] = useState<boolean>(false);
  return (
    <>
      <button
        type="button"
        aria-controls={id}
        className="govuk-accordion__show-all"
        aria-expanded={expanded}
        onClick={() => setExpanded(!expanded)}
      >
        <span
          className={`govuk-accordion-nav__chevron ${
            !expanded && 'govuk-accordion-nav__chevron--down'
          }`}
        />
        <span className="govuk-accordion__show-all-text">
          {expanded ? 'Hide all details' : 'Show all details'}
        </span>
      </button>
      <div hidden={!expanded} id={id}>
        {children}
      </div>
    </>
  );
}
