'use client';
import * as GovUK from '@wts/ui/govuk-react-ui';
import { useTranslation } from '../../../utils/useTranslation';
import { signIn, useSession } from 'next-auth/react';
import React, { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

const Loading = () => {
  return <>Loading</>;
};

const PageContent = () => {
  const { t } = useTranslation('auth');
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    if (session) {
      const callbackUrl = searchParams.get('callbackUrl');
      router.push(callbackUrl !== null ? callbackUrl.toString() : '/account');
    }
  }, [session]);
  return (
    <>
      <GovUK.Heading size={'l'} level={1}>
        {t('signinPage.title')}
      </GovUK.Heading>
      <GovUK.Button
        onClick={() => {
          signIn('defra-b2c');
        }}
      >
        {t('signinPage.button')}
      </GovUK.Button>
    </>
  );
};

export default function Index() {
  return (
    <>
      <GovUK.GridRow>
        <GovUK.GridCol size={'two-thirds'}>
          <Suspense fallback={<Loading />}>
            <PageContent />
          </Suspense>
        </GovUK.GridCol>
      </GovUK.GridRow>
    </>
  );
}
