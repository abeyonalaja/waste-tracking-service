import { ReactNode } from 'react';

type Props = {
  children?: ReactNode;
  testId?: string;
  href?: string;
};

export const Link = ({ href, children, testId }: Props) => {
  return (
    <a href={href} className={`govuk-link`} data-testid={testId}>
      {children}
    </a>
  );
};
