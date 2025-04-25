import * as GovUK from '@wts/ui/govuk-react-ui';
import { Page } from '@wts/ui/shared-ui/server';
import { NewWasteMovementsCard } from '@wts/app-uk-waste-movements/feature-homepage/server';
import { Breadcrumbs } from '@wts/ui/shared-ui';
import { getServerSession } from 'next-auth';
import { options } from './api/auth/[...nextauth]/options';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { differenceInDays } from 'date-fns';
import { headers } from 'next/headers';
import {
  getUserPaymentStatus,
  formatExpiryDate,
} from '@wts/app-waste-tracking-service/feature-service-charge';
import { PaymentReference } from '@wts/api/waste-tracking-gateway';

export const metadata = {
  title: 'Move and track waste in the UK',
};

export default async function Index(): Promise<JSX.Element> {
  const t = await getTranslations('homePage');
  let serviceChargePaid = false;
  let showServiceChargeReminder = false;
  let serviceChargeExpiryDate = '';
  const session = await getServerSession(options);

  if (!session || !session.user) {
    return redirect('/auth/signin');
  }

  if (session.token === undefined || session.token === null) {
    console.error('No session or token present');
    return redirect('/404');
  }

  const serviceChargeEnabled = process.env.SERVICE_CHARGE_ENABLED === 'true';

  if (serviceChargeEnabled) {
    const headerList = headers();
    const hostname = headerList.get('host') || '';
    let response: Response;

    try {
      response = await getUserPaymentStatus(hostname, session.token as string);
    } catch (error) {
      console.error('Error fetching payments', error);
      return redirect('/error');
    }

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
  }

  return (
    <Page
      beforeChildren={
        <Breadcrumbs
          items={[
            { text: t('breadcrumbs.home'), href: '../account' },
            { text: t('breadcrumbs.current') },
          ]}
        />
      }
    >
      {serviceChargeEnabled && !serviceChargePaid && (
        <GovUK.GridRow>
          <GovUK.GridCol size="two-thirds-from-desktop">
            <GovUK.NotificationBanner title="Important">
              {t('serviceChargeBanner.one')}
              <Link
                className="govuk-notification-banner__link"
                href="../service-charge/guidance"
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
                href="../service-charge/guidance"
              >
                {t('serviceChargeRenewalBanner.link')}
              </Link>
              .
            </GovUK.NotificationBanner>
          </GovUK.GridCol>
        </GovUK.GridRow>
      )}
      <GovUK.Heading size={'l'} level={1}>
        {t('title')}
      </GovUK.Heading>
      <NewWasteMovementsCard />
    </Page>
  );
}
