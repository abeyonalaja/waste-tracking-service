import { ReactNode } from 'react';
interface Props {
  children?: ReactNode;
  testId?: string;
}

export const ButtonGroup = ({ children, testId }: Props): JSX.Element => {
  return (
    <div className="govuk-button-group" data-testid={testId}>
      {children}
    </div>
  );
};
