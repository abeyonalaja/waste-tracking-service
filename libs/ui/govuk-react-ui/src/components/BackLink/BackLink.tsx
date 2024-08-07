import React, { MouseEventHandler } from 'react';

interface Props {
  text?: string;
  testId?: string;
  href?: string;
  onClick?: MouseEventHandler<HTMLAnchorElement> | undefined;
}

export const BackLink: React.FC<Props> = ({
  text = 'Back',
  testId,
  href = '#',
  onClick,
}: Props) => {
  return (
    <a
      href={href}
      className={`govuk-back-link`}
      onClick={onClick}
      data-testid={testId}
    >
      {text}
    </a>
  );
};
