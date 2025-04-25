import * as GovUK from '@wts/ui/govuk-react-ui';
import { Page } from '@wts/ui/shared-ui/server';
import Link from 'next/link';
import SignOutUser from './_components/SignOutUser';

export const metadata = {
  title: 'For your security, we signed you out',
};

export default async function SignedOut(): Promise<JSX.Element> {
  return (
    <Page>
      <GovUK.GridRow>
        <GovUK.GridCol size={'two-thirds'}>
          <GovUK.Heading size={'l'}>
            For your security, we signed you out
          </GovUK.Heading>
          <GovUK.Paragraph>We have saved your answers.</GovUK.Paragraph>
          <GovUK.Paragraph>
            You can close this tab or{' '}
            <Link
              href="/auth/signin"
              className={`govuk-link govuk-link--no-visited-state`}
            >
              sign in again
            </Link>
            .
          </GovUK.Paragraph>
          <SignOutUser />
        </GovUK.GridCol>
      </GovUK.GridRow>
    </Page>
  );
}
