import { ReactNode } from 'react';

interface Props {
  text?: string;
  children?: ReactNode;
  id?: string;
  testId?: string;
}

export const Hint = ({ children, id, text, testId }: Props): JSX.Element => {
  return (
    <div className="govuk-hint" data-testid={testId} id={`${id}-hint`}>
      {text || children}
    </div>
  );
};
