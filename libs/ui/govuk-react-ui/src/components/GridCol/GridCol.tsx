import { ReactNode } from 'react';

interface Props {
  children?: ReactNode;
  size?:
    | 'full'
    | 'one-half'
    | 'one-third'
    | 'two-thirds'
    | 'one-quarter'
    | 'three-quarters'
    | 'two-thirds-from-desktop'
    | 'one-third-from-desktop'
    | 'one-quarter-from-desktop'
    | 'three-quarters-from-desktop';
  testId?: string;
}

export const GridCol = ({
  children,
  size = 'two-thirds',
  testId,
}: Props): JSX.Element => {
  return (
    <div className={`govuk-grid-column-${size}`} data-testid={testId}>
      {children}
    </div>
  );
};
