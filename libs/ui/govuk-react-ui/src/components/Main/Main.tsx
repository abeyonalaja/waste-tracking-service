import { ReactNode } from 'react';

type Props = {
  children?: ReactNode;
  testId?: string;
};

export const Main = ({ children, testId }: Props) => {
  return (
    <main
      className={`govuk-main-wrapper`}
      data-testid={testId}
      id={`main-content`}
    >
      {children}
    </main>
  );
};
