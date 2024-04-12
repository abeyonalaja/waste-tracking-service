import { ReactNode } from 'react';

type Props = {
  text?: string;
  children?: ReactNode;
  testId?: string;
};

export const ErrorMessage = ({ text, children, testId }: Props) => {
  return (
    <p className={`govuk-error-message`} data-testid={testId}>
      {text || children}
    </p>
  );
};
