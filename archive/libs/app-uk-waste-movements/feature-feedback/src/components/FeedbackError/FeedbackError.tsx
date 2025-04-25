'use client';

import * as GovUK from '@wts/ui/govuk-react-ui';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useNewWindow } from '@wts/ui/shared-ui';

export interface errorStrings {
  heading: string;
  paragraphOne: string;
  paragraphTwo: string;
  backLink: string;
  backLinkNewWindow: string;
}

interface FeedbackErrorProps {
  strings: errorStrings;
}

export function FeedbackError({ strings }: FeedbackErrorProps): JSX.Element {
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
