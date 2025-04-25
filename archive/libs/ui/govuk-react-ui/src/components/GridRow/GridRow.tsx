import { ReactNode } from 'react';

interface GridRowProps {
  children?: ReactNode;
  testId?: string;
}

export function GridRow({ children, testId }: GridRowProps): JSX.Element {
  return (
    <div className={`govuk-grid-row`} data-testid={testId}>
      {children}
    </div>
  );
}
