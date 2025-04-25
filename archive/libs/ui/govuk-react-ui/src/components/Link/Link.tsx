import { ReactNode } from 'react';

interface Props {
  children?: ReactNode;
  testId?: string;
  href?: string;
  target?: '_blank' | '_self' | '_parent' | '_top';
}

export const Link = ({
  href,
  target,
  children,
  testId,
}: Props): JSX.Element => {
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
