import { ReactNode } from 'react';

interface SummaryCardProps {
  title?: string;
  children?: ReactNode;
  testId?: string;
}

export function SummaryCard({ title, children, testId }: SummaryCardProps) {
  return (
    <div className="govuk-summary-card" data-testId={testId}>
      <div className="govuk-summary-card__title-wrapper">
        <h2 className="govuk-summary-card__title">{title}</h2>
      </div>
      <div className="govuk-summary-card__content">{children}</div>
    </div>
  );
}
