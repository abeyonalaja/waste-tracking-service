import { ReactNode } from 'react';

interface SummaryCardProps {
  title?: string;
  children?: ReactNode;
  testId?: string;
  id?: string;
}

export function SummaryCard({
  title,
  children,
  testId,
  id,
}: SummaryCardProps): JSX.Element {
  return (
    <div className="govuk-summary-card" data-testid={testId}>
      <div className="govuk-summary-card__title-wrapper">
        <h2 className="govuk-summary-card__title" id={id && `${id}-heading`}>
          {title}
        </h2>
      </div>
      <div className="govuk-summary-card__content">{children}</div>
    </div>
  );
}
