import { ReactNode } from 'react';

type Props = {
  text?: string;
  children?: ReactNode;
  inputId: string;
  testId?: string;
};

export const Label = ({ text, children, inputId, testId }: Props) => {
  return (
    <label className={`govuk-label`} htmlFor={inputId} data-testid={testId}>
      {text || children}
    </label>
  );
};
