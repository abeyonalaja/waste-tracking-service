import { ReactNode } from 'react';

type Props = {
  children?: ReactNode;
  testId?: string;
};

export const GridRow = ({ children, testId }: Props) => {
  return (
    <div className="govuk-grid-row" data-testid={testId}>
      {children}
    </div>
  );
};
