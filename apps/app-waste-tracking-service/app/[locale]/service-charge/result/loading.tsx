import { useTranslations } from 'next-intl';
import * as GovUK from '@wts/ui/govuk-react-ui';
import { Page } from '@wts/ui/shared-ui/server';
import { StatusChecker } from '@wts/app-waste-tracking-service/feature-service-charge';

export default function Loading(): React.ReactNode {
  const t = useTranslations('charge.result');

  return (
    <Page>
      <GovUK.GridRow>
        <GovUK.GridCol size="full">
          <StatusChecker label={t('loadingTitle')} />
        </GovUK.GridCol>
      </GovUK.GridRow>
    </Page>
  );
}
