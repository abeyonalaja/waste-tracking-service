import { ReactNode } from 'react';

type Props = {
  size?: 's' | 'm' | 'l' | 'xl';
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  children?: ReactNode;
  testId?: string;
  id?: string;
};

export const Heading = ({
  size = 'l',
  level = 1,
  children,
  testId,
  id,
}: Props) => {
  const HeadingLevel = `h${level}` as keyof JSX.IntrinsicElements;
  return (
    <HeadingLevel
      id={id}
      className={`govuk-heading-${size}`}
      data-testid={testId}
    >
      {children}
    </HeadingLevel>
  );
};
