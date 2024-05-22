import { ReactNode } from 'react';
import { Tag } from '../Tag';

interface Props {
  children?: ReactNode;
  tag: string;
  testId?: string;
}

export const PhaseBanner = ({ children, tag, testId }: Props): JSX.Element => {
  return (
    <div className="govuk-phase-banner" data-testid={testId}>
      <p className="govuk-phase-banner__content">
        <Tag classes={`govuk-phase-banner__content__tag`}>{tag}</Tag>
        <span className="govuk-phase-banner__text">{children}</span>
      </p>
    </div>
  );
};
