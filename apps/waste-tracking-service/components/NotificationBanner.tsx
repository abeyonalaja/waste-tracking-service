import React from 'react';
import { BreakableString } from './BreakableString';

export const NotificationBanner = ({
  type,
  headingText,
  id = undefined,
  children = null,
}) => {
  const bannerClasses = `govuk-notification-banner ${
    type === 'important'
      ? 'govuk-notification-banner--important'
      : 'govuk-notification-banner--success'
  }`;

  return (
    <div
      className={bannerClasses}
      role="alert"
      aria-labelledby="govuk-notification-banner-title"
      id={id}
    >
      <div className="govuk-notification-banner__header">
        <h2
          className="govuk-notification-banner__title"
          id="govuk-notification-banner-title"
        >
          {type === 'important' ? 'Important' : 'Success'}
        </h2>
      </div>
      <div className="govuk-notification-banner__content">
        <h3 className="govuk-notification-banner__heading" id={`${id}_body`}>
          <BreakableString>{headingText}</BreakableString>
        </h3>
        {children && <p>{children}</p>}
      </div>
    </div>
  );
};
