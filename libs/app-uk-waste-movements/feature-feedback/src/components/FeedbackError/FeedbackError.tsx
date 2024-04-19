'use client';

import * as GovUK from '@wts/ui/govuk-react-ui';
import { Link, useRouter } from '@wts/ui/navigation';
import { useNewWindow } from '@wts/ui/shared-ui';

export type errorStrings = {
  heading: string;
  paragraphOne: string;
  paragraphTwo: string;
  backLink: string;
  backLinkNewWindow: string;
};

type FeedbackErrorProps = {
  strings: errorStrings;
};

export function FeedbackError({ strings }: FeedbackErrorProps) {
  const router = useRouter();
  const isNewWindow = useNewWindow();

  return (
    <>
      <GovUK.Heading level={1} size="l">
        {strings.heading}
      </GovUK.Heading>
      <GovUK.Paragraph>{strings.paragraphOne}</GovUK.Paragraph>
      <GovUK.Paragraph>{strings.paragraphTwo}</GovUK.Paragraph>
      {isNewWindow ? (
        // Removes back link if feedback page is opened in new window/tab
        // and links user back to home page rather than navigating back
        <Link href="../" target="_self">
          {strings.backLinkNewWindow}
        </Link>
      ) : (
        <Link
          href="#"
          target="_self"
          onClick={(e) => {
            e.preventDefault();
            router.back();
          }}
        >
          {strings.backLink}
        </Link>
      )}
    </>
  );
}
