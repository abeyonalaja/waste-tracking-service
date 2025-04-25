import React from 'react';
import { BreakableString } from './BreakableString';

interface NotificationBannerProps {
  headingLevel?: number;
  type: 'important' | 'success';
  headingText: string;
  id?: string;
  children?: React.ReactNode;
}

export const NotificationBanner = ({
  headingLevel = 2,
  type,
  headingText,
  id = undefined,
  children = null,
}: NotificationBannerProps): React.ReactNode => {
  const bannerClasses = `govuk-notification-banner ${
    type === 'important'
      ? 'govuk-notification-banner--important'
      : 'govuk-notification-banner--success'
  }`;

  if (headingLevel === 1) {
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
          <h1 className="govuk-notification-banner__heading" id={`${id}_body`}>
            <BreakableString>{headingText}</BreakableString>
          </h1>
          {children && <p>{children}</p>}
        </div>
      </div>
    );
  }

  if (headingLevel === 2) {
    return (
      <div
        className={bannerClasses}
        role="alert"
        aria-labelledby="govuk-notification-banner-title"
        id={id}
      >
        <div className="govuk-notification-banner__header">
          <h3
            className="govuk-notification-banner__title"
            id="govuk-notification-banner-title"
          >
            {type === 'important' ? 'Important' : 'Success'}
          </h3>
        </div>
        <div className="govuk-notification-banner__content">
          <h2 className="govuk-notification-banner__heading" id={`${id}_body`}>
            <BreakableString>{headingText}</BreakableString>
          </h2>
          {children && <p>{children}</p>}
        </div>
      </div>
    );
  }

  if (headingLevel === 3) {
    return (
      <div
        className={bannerClasses}
        role="alert"
        aria-labelledby="govuk-notification-banner-title"
        id={id}
      >
        <div className="govuk-notification-banner__header">
          <h4
            className="govuk-notification-banner__title"
            id="govuk-notification-banner-title"
          >
            {type === 'important' ? 'Important' : 'Success'}
          </h4>
        </div>
        <div className="govuk-notification-banner__content">
          <h3 className="govuk-notification-banner__heading" id={`${id}_body`}>
            <BreakableString>{headingText}</BreakableString>
          </h3>
          {children && <p>{children}</p>}
        </div>
      </div>
    );
  }

  return (
    <div
      className={bannerClasses}
      role="alert"
      aria-labelledby="govuk-notification-banner-title"
      id={id}
    >
      <div className="govuk-notification-banner__header">
        <h5
          className="govuk-notification-banner__title"
          id="govuk-notification-banner-title"
        >
          {type === 'important' ? 'Important' : 'Success'}
        </h5>
      </div>
      <div className="govuk-notification-banner__content">
        <h4 className="govuk-notification-banner__heading" id={`${id}_body`}>
          <BreakableString>{headingText}</BreakableString>
        </h4>
        {children && <p>{children}</p>}
      </div>
    </div>
  );
};
