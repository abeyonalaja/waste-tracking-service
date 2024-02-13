import { ReactNode } from 'react';
import { Tag } from '../Tag';

type Props = {
  children?: ReactNode;
  tag: string;
  testId?: string;
};

export const PhaseBanner = ({ children, testId }: Props) => {
  return (
    <div className="govuk-phase-banner" data-testid={testId}>
      <p className="govuk-phase-banner__content">
        <Tag classes={`govuk-phase-banner__content__tag`}>Beta</Tag>
        <span className="govuk-phase-banner__text">{children}</span>
      </p>
    </div>
  );
};
