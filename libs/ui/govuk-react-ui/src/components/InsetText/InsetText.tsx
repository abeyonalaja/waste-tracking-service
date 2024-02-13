import { ReactNode } from 'react';

type Props = {
  children?: ReactNode;
  testId?: string;
};

export const InsetText = ({ children, testId }: Props) => {
  return (
    <div className="govuk-inset-text" data-testid={testId}>
      {children}
    </div>
  );
};
