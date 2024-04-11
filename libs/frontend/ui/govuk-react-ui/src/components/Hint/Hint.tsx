import { ReactNode } from 'react';

type Props = {
  text?: string;
  children?: ReactNode;
  id?: string;
  testId?: string;
};

export const Hint = ({ children, id, text, testId }: Props) => {
  return (
    <div className="govuk-hint" data-testid={testId} id={id}>
      {text || children}
    </div>
  );
};
