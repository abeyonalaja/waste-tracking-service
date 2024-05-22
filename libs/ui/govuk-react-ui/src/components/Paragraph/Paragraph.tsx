import { ReactNode } from 'react';

interface Props {
  size?: 's' | 'm' | 'l';
  mb?: number;
  children?: ReactNode;
  testId?: string;
}

export const Paragraph = ({
  size = 'm',
  mb,
  children,
  testId,
}: Props): JSX.Element => {
  return (
    <p
      className={
        mb
          ? `govuk-body-${size} govuk-!-margin-bottom-${mb}`
          : `govuk-body-${size}`
      }
      data-testid={testId}
    >
      {children}
    </p>
  );
};
