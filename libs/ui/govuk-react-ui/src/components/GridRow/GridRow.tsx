import { ReactNode } from 'react';

interface GridRowProps {
  children?: ReactNode;
  testId?: string;
  mb?: number;
}

export function GridRow({ children, testId, mb }: GridRowProps) {
  return (
    <div
      className={`govuk-grid-row govuk-!-margin-bottom-${mb}`}
      data-testid={testId}
    >
      {children}
    </div>
  );
}
