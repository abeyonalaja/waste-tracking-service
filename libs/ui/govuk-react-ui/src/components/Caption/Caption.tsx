import { ReactNode } from 'react';

type Props = {
  size?: 'm' | 'l' | 'xl';
  children?: ReactNode;
  testId?: string;
};

export const Caption = ({ size = 'l', children, testId }: Props) => {
  return (
    <span className={`govuk-caption-${size}`} data-testid={testId}>
      {children}
    </span>
  );
};
