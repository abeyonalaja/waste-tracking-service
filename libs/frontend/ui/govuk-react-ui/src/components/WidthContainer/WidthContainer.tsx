import { ReactNode } from 'react';

type Props = {
  children?: ReactNode;
  testId?: string;
};

export const WidthContainer = ({ children, testId }: Props) => {
  return (
    <div className="govuk-width-container" data-testid={testId}>
      {children}
    </div>
  );
};
