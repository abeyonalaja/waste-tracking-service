import { ReactNode } from 'react';

interface Props {
  size?: 'm' | 'l' | 'xl';
  children?: ReactNode;
  testId?: string;
}

export const Caption = ({
  size = 'l',
  children,
  testId,
}: Props): JSX.Element => {
  return (
    <span className={`govuk-caption-${size}`} data-testid={testId}>
      {children}
    </span>
  );
};
