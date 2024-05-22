import { ReactNode } from 'react';

interface Props {
  children?: ReactNode;
  headingLevel?: number;
  title?: string;
  id?: string;
  testId?: string;
  success?: boolean;
}

export const NotificationBanner = ({
  children,
  headingLevel = 2,
  title,
  id,
  testId,
  success,
}: Props): JSX.Element => {
  const HeadingLevel = `h${headingLevel}` as keyof JSX.IntrinsicElements;
  return (
    <div
      className={`govuk-notification-banner ${
        success && `govuk-notification-banner--success`
      }`}
      id={id}
      data-testid={testId}
    >
      {title && (
        <div className="govuk-notification-banner__header">
          <HeadingLevel
            className="govuk-notification-banner__title"
            id="govuk-notification-banner-title"
          >
            {title}
          </HeadingLevel>
        </div>
      )}
      <div className="govuk-notification-banner__content">
        <p className="govuk-notification-banner__heading">{children}</p>
      </div>
    </div>
  );
};
