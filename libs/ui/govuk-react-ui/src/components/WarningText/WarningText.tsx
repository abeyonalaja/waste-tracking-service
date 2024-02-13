import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  testId?: string;
};

export const WarningText = ({ children, testId }: Props) => {
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
