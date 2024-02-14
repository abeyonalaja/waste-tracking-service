import { ReactNode } from 'react';

type Props = {
  children?: ReactNode;
  testId?: string;
  href?: string;
  target?: '_blank' | '_self' | '_parent' | '_top';
};

export const Link = ({ href, target, children, testId }: Props) => {
  return (
    <a
      href={href}
      target={target}
      className={`govuk-link`}
      data-testid={testId}
    >
      {children}
    </a>
  );
};
