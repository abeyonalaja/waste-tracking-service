import * as GovUK from '@wts/ui/govuk-react-ui';
import { GridRow, LinkCard } from '../components';
import { getTranslations } from 'next-intl/server';
import UserHeading from './_components/UserHeading';
import { getServerSession } from 'next-auth';
import { Page } from '@wts/ui/shared-ui/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { headers } from 'next/headers';
import {
  getUserPaymentStatus,
  formatExpiryDate,
} from '@wts/app-waste-tracking-service/feature-service-charge';
import { PaymentReference } from '@wts/api/waste-tracking-gateway';
import { cookies } from 'next/headers';
import { options } from '../api/auth/[...nextauth]/options';
import { differenceInDays } from 'date-fns';

export const metadata = {
  title: 'Waste tracking service',
};

export default async function Index(): Promise<JSX.Element> {
  const session = await getServerSession(options);
  let serviceChargePaid = false;
  let showServiceChargeReminder = false;
  let serviceChargeExpiryDate = '';

  const t = await getTranslations({ namespace: 'accountPage' });
  const serviceChargeEnabled = process.env.SERVICE_CHARGE_ENABLED === 'true';

  if (serviceChargeEnabled) {
    const headerList = headers();
    const hostname = headerList.get('host') || '';
    let response: Response;
    try {
      response = await getUserPaymentStatus(hostname, session?.token as string);
      const paymentReference = (await response.json()) as PaymentReference;
      serviceChargePaid = paymentReference.serviceChargePaid;

      if (serviceChargePaid) {
        const daysUntilExpiry = differenceInDays(
          new Date(paymentReference.expiryDate),
          new Date(),
        );
        showServiceChargeReminder = daysUntilExpiry < 28;
        serviceChargeExpiryDate = formatExpiryDate(paymentReference.expiryDate);
      }
    } catch (error) {
      console.error('Error fetching payments', error);
    }
  }

  const serviceChargeGuidanceViewed = cookies().get(
    'serviceChargeGuidanceViewed',
  );

  if (!serviceChargePaid && !serviceChargeGuidanceViewed) {
    return redirect('/service-charge/guidance');
  }

  return (
    <Page>
      {serviceChargeEnabled && !serviceChargePaid && (
        <GovUK.GridRow>
          <GovUK.GridCol size="two-thirds-from-desktop">
            <GovUK.NotificationBanner title="Important">
              {t('serviceChargeBanner.one')}
              <Link
                className="govuk-notification-banner__link"
                href="/service-charge"
              >
                {t('serviceChargeBanner.link')}
              </Link>
              {t('serviceChargeBanner.two')}
            </GovUK.NotificationBanner>
          </GovUK.GridCol>
        </GovUK.GridRow>
      )}
      {serviceChargeEnabled && showServiceChargeReminder && (
        <GovUK.GridRow>
          <GovUK.GridCol size="two-thirds-from-desktop">
            <GovUK.NotificationBanner title="Important">
              {t('serviceChargeRenewalBanner.text', {
                date: serviceChargeExpiryDate,
              })}
              <Link
                className="govuk-notification-banner__link"
                href="/service-charge/guidance"
              >
                {t('serviceChargeRenewalBanner.link')}
              </Link>
              .
            </GovUK.NotificationBanner>
          </GovUK.GridCol>
        </GovUK.GridRow>
      )}
      <GovUK.GridRow>
        <GovUK.GridCol size="full">
          <UserHeading />
          <GovUK.Heading size={'m'} level={2}>
            {t('title')}
          </GovUK.Heading>
          <GovUK.SectionBreak size={'l'} />
          <GridRow display="flex-from-tablet">
            {process.env.NEXT_PUBLIC_UKWM_ENABLED === 'true' && (
              <GovUK.GridCol size="one-third">
                <LinkCard
                  id="link-card-UKWM"
                  title={t('cards.UKWM.title')}
                  content={t('cards.UKWM.description')}
                  href="/move-waste"
                />
              </GovUK.GridCol>
            )}

            <GovUK.GridCol size="one-third">
              <LinkCard
                id="link-card-GLW"
                title={t('cards.GLW.title')}
                content={t('cards.GLW.description')}
                href="/export-annex-VII-waste"
              />
            </GovUK.GridCol>
          </GridRow>
        </GovUK.GridCol>
      </GovUK.GridRow>
    </Page>
  );
}
