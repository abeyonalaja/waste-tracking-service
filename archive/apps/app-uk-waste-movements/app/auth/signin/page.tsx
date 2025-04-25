import SignInButton from './_components/SignInButton';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { Loading, Page } from '@wts/ui/shared-ui/server';
import React, { Suspense } from 'react';

export const metadata = {
  title: 'Waste tracking service',
};

export default async function Index({
  searchParams,
}: {
  searchParams: Record<string, string>;
}): Promise<JSX.Element> {
  const session = await getServerSession();

  if (session) {
    const { callbackUrl } = searchParams;
    redirect(callbackUrl ? callbackUrl.toString() : '/');
  }

  return (
    <>
      <Page>
        <Loading centered={true} />
        <Suspense>
          <SignInButton />
        </Suspense>
      </Page>
    </>
  );
}
