import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  testId?: string;
}

export const WarningText = ({ children, testId }: Props): JSX.Element => {
  return (
    <div className="govuk-warning-text" data-testid={testId}>
      <span className="govuk-warning-text__icon" aria-hidden="true">
        !
      </span>
      <strong className="govuk-warning-text__text">
        <span className="govuk-visually-hidden">Warning</span>
        {children}
      </strong>
    </div>
  );
};
