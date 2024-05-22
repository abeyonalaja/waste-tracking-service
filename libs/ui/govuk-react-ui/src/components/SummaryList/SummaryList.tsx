import { ReactNode } from 'react';

interface SummaryListProps {
  testId?: string;
  items: Array<{ key: string; value: ReactNode }>;
}

export function SummaryList({ testId, items }: SummaryListProps): JSX.Element {
  return (
    <dl className="govuk-summary-list" data-testid={testId}>
      {items.map((item, index) => (
        <div
          key={`govuk-summary-list-element-${index}`}
          className="govuk-summary-list__row"
        >
          <dt className="govuk-summary-list__key">{item.key}</dt>
          <dd className="govuk-summary-list__value">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
