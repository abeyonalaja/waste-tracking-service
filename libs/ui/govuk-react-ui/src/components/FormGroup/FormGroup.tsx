import { ReactNode } from 'react';

interface Props {
  children?: ReactNode;
  error?: boolean;
  testId?: string;
  id?: string;
}

export const FormGroup = ({
  children,
  error,
  testId,
  id,
}: Props): JSX.Element => {
  return (
    <div
      className={`govuk-form-group ${error ? 'govuk-form-group--error' : ''}`}
      data-testid={testId}
      id={id}
    >
      {children}
    </div>
  );
};
