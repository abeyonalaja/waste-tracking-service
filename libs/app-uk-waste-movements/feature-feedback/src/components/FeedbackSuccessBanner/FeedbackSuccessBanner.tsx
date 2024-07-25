'use client';

import * as GovUK from '@wts/ui/govuk-react-ui';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useNewWindow } from '@wts/ui/shared-ui';
export interface successStrings {
  bannerTitle: string;
  bannerHeading: string;
  backLink: string;
  backLinkNewWindow: string;
}

interface FeedbackSuccessBannerProps {
  strings: successStrings;
}

export function FeedbackSuccessBanner({
  strings,
}: FeedbackSuccessBannerProps): JSX.Element {
  const isNewWindow = useNewWindow();
  const router = useRouter();
  return (
    <GovUK.NotificationBanner title={strings.bannerTitle} success={true}>
      <GovUK.Heading
        size="m"
        level={3}
        id="govuk-notification-banner-content-heading"
      >
        {strings.bannerHeading}
      </GovUK.Heading>
      {isNewWindow ? ( // Removes back link if feedback page is opened in new window/tab
        // and links user back to home page rather than navigating back
        <Link
          className="govuk-notification-banner__link"
          href="../"
          target="_self"
          id=""
        >
          {strings.backLinkNewWindow}
        </Link>
      ) : (
        <Link
          className="govuk-notification-banner__link"
          href="/"
          target="_self"
          onClick={(e) => {
            e.preventDefault();
            router.back();
          }}
        >
          {strings.backLink}
        </Link>
      )}
    </GovUK.NotificationBanner>
  );
}
