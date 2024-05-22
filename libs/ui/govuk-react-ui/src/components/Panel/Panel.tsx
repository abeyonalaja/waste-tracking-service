import { ReactNode } from 'react';

interface Props {
  children?: ReactNode;
  testId?: string;
  title: string;
}

export const Panel = ({ children, testId, title }: Props): JSX.Element => {
  return (
    <div className="govuk-panel govuk-panel--confirmation" data-testid={testId}>
      <h1 className="govuk-panel__title">{title}</h1>
      {children && <div className="govuk-panel__body">{children}</div>}
    </div>
  );
};
