import { ReactNode } from 'react';

interface Props {
  children?: ReactNode;
  testId?: string;
}

export const WidthContainer = ({ children, testId }: Props): JSX.Element => {
  return (
    <div className="govuk-width-container" data-testid={testId}>
      {children}
    </div>
  );
};
