import React from 'react';

interface Props {
  text?: string;
  testId?: string;
  href: string;
}

export const BackLink: React.FC<Props> = ({
  text = 'Back',
  testId,
  href,
}: Props) => {
  return (
    <a href={href} className={`govuk-back-link`} data-testid={testId}>
      {text}
    </a>
  );
};
