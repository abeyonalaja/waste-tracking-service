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
          <div className="govuk-notification-banner__title">{title}</div>
        </div>
      )}
      <div className="govuk-notification-banner__content">{children}</div>
    </div>
  );
};
