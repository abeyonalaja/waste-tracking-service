import { ReactNode } from 'react';

interface Props {
  text?: string;
  children?: ReactNode;
  inputId: string;
  testId?: string;
}

export const Label = ({
  text,
  children,
  inputId,
  testId,
}: Props): JSX.Element => {
  return (
    <label className={`govuk-label`} htmlFor={inputId} data-testid={testId}>
      {text || children}
    </label>
  );
};
