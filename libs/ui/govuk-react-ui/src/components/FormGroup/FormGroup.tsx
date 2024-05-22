import { ReactNode } from 'react';

interface Props {
  children?: ReactNode;
  error?: boolean;
  testId?: string;
}

export const FormGroup = ({ children, error, testId }: Props): JSX.Element => {
  return (
    <div
      className={`govuk-form-group ${error ? 'govuk-form-group--error' : ''}`}
      data-testid={testId}
    >
      {children}
    </div>
  );
};
