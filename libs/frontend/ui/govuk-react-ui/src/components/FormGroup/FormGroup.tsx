import { ReactNode } from 'react';

type Props = {
  children?: ReactNode;
  error?: boolean;
  testId?: string;
};

export const FormGroup = ({ children, error, testId }: Props) => {
  return (
    <div
      className={`govuk-form-group ${error ? 'govuk-form-group--error' : ''}`}
      data-testid={testId}
    >
      {children}
    </div>
  );
};
