import { ReactNode } from 'react';

interface Props {
  text?: string;
  children?: ReactNode;
  testId?: string;
}

export const ErrorMessage = ({
  text,
  children,
  testId,
}: Props): JSX.Element => {
  return (
    <p className={`govuk-error-message`} data-testid={testId}>
      {text || children}
    </p>
  );
};
