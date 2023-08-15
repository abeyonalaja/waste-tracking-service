import React from 'react';

export const NotificationBanner = ({ type, headingText }) => {
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
      data-module="govuk-notification-banner"
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
        <h3 className="govuk-notification-banner__heading">{headingText}</h3>
      </div>
    </div>
  );
};
