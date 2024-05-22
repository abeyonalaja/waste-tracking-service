import { ReactNode } from 'react';

interface Props {
  children?: ReactNode;
  testId?: string;
}

export const InsetText = ({ children, testId }: Props): JSX.Element => {
  return (
    <div className="govuk-inset-text" data-testid={testId}>
      {children}
    </div>
  );
};
