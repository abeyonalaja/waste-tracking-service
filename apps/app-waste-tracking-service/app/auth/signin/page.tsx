'use client';
import * as GovUK from '@wts/ui/govuk-react-ui';
import { useTranslation } from '../../../utils/useTranslation';
import { signIn } from 'next-auth/react';
import React from 'react';

export default function Index() {
  const { t } = useTranslation('auth');
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
