import { ReactNode } from 'react';

type Props = {
  children?: ReactNode;
  title?: string;
  testId?: string;
  success?: 'success';
};

export const NotificationBanner = ({
  children,
  title,
  testId,
  success,
}: Props) => {
  return (
    <div
      className={`govuk-notification-banner ${
        success && `govuk-notification-banner--success`
      }`}
      data-testid={testId}
    >
      {title && (
        <div className="govuk-notification-banner__header">
          <h2
            className="govuk-notification-banner__title"
            id="govuk-notification-banner-title"
          >
            {title}
          </h2>
        </div>
      )}
      <div className="govuk-notification-banner__content">{children}</div>
    </div>
  );
};
