import { ReactNode } from 'react';

type Props = {
  size?: 's' | 'm' | 'l';
  children?: ReactNode;
  testId?: string;
};

export const Paragraph = ({ size = 'm', children, testId }: Props) => {
  return (
    <p className={`govuk-body-${size}`} data-testid={testId}>
      {children}
    </p>
  );
};
