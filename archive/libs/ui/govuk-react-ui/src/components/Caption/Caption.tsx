import { HTMLAttributes, ReactNode } from 'react';

interface CustomProps {
  size?: 'm' | 'l' | 'xl';
  children?: ReactNode;
  testId?: string;
}

type CaptionProps = HTMLAttributes<HTMLSpanElement> & CustomProps;

export const Caption = ({
  size = 'l',
  children,
  testId,
  ...rest
}: CaptionProps): JSX.Element => {
  return (
    <span {...rest} className={`govuk-caption-${size}`} data-testid={testId}>
      {children}
    </span>
  );
};
