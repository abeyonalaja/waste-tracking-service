'use client';
import * as GovUK from '@wts/ui/govuk-react-ui';
import { useTranslation } from '../../../utils/useTranslation';
import { signIn, useSession } from 'next-auth/react';
import React, { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function Index() {
  const { t } = useTranslation('auth');
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  useEffect(() => {
    if (session) {
      const callbackUrl = searchParams.get('callbackUrl');
      router.push(callbackUrl !== null ? callbackUrl.toString() : '/account');
    }
  }, [session, searchParams]);
  return (
    <>
      <GovUK.GridRow>
        <GovUK.GridCol size={'two-thirds'}>
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
        </GovUK.GridCol>
      </GovUK.GridRow>
    </>
  );
}
