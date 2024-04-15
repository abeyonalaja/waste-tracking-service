import * as GovUK from '@wts/ui/govuk-react-ui';
import SignInButton from './_components/SignInButton';
import { getServerSession } from 'next-auth';
import { redirect } from '@wts/ui/navigation';
import { Loading, Page } from '@wts/ui/shared-ui/server';
import React, { Suspense } from 'react';

export const metadata = {
  title: 'Waste tracking service',
};

export default async function Index({
  searchParams,
}: {
  searchParams: Record<string, string>;
}) {
  const session = await getServerSession();

  if (session) {
    const { callbackUrl } = searchParams;
    redirect(callbackUrl ? callbackUrl.toString() : '/');
  }

  return (
    <>
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
    </>
  );
}
