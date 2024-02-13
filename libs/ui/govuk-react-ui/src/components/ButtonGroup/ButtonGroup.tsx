import { ReactNode } from 'react';

type Props = {
  children?: ReactNode;
  testId?: string;
};

export const ButtonGroup = ({ children, testId }: Props) => {
  return (
    <div className="govuk-button-group" data-testid={testId}>
      {children}
    </div>
  );
};
