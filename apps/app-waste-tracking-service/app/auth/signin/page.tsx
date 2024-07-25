import * as GovUK from '@wts/ui/govuk-react-ui';
import SignInButton from './_components/SignInButton';
import { getServerSession, Session } from 'next-auth';
import { redirect } from 'next/navigation';
import React, { Suspense } from 'react';
import { Page, Loading } from '@wts/ui/shared-ui/server';

export const metadata = {
  title: 'Waste tracking service',
};

export default async function Index({
  searchParams,
}: {
  searchParams: Record<string, string>;
}): Promise<JSX.Element> {
  const session: Session | null = await getServerSession();
  if (session) {
    const { callbackUrl } = searchParams;
    redirect(callbackUrl ? callbackUrl.toString() : '/account');
  }

  return (
    <Page>
      <GovUK.GridRow>
        <GovUK.GridCol size={'two-thirds'}>
          <Loading />
          <Suspense>
            <SignInButton />
          </Suspense>
        </GovUK.GridCol>
      </GovUK.GridRow>
    </Page>
  );
}
