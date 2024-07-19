import * as GovUK from '@wts/ui/govuk-react-ui';
import { GridRow, LinkCard } from '../../components';
import { getTranslations } from 'next-intl/server';
import UserHeading from './_components/UserHeading';
import { getServerSession } from 'next-auth';
import { Page } from '@wts/ui/shared-ui/server';
import { redirect, Link } from '@wts/ui/navigation';
import { headers } from 'next/headers';
import { getUserPaymentStatus } from '@wts/app-waste-tracking-service/feature-service-charge';
import { PaymentReference } from '@wts/api/waste-tracking-gateway';
import { cookies } from 'next/headers';
import { options } from '../../api/auth/[...nextauth]/options';

export const metadata = {
  title: 'Waste tracking service',
};

export default async function Index(): Promise<JSX.Element> {
  const session = await getServerSession(options);
  let serviceChargePaid = false;

  // Redirect to sign in page if not logged-in
  if (!session || !session.user) {
    return redirect('/auth/signin');
  }

  // Guard against missing token
  if (session.token === undefined || session.token === null) {
    console.error('No session or token present');
    return redirect('/404');
  }

  // Check if user has paid the service charge if feature is enabled
  const serviceChargeEnabled = process.env.SERVICE_CHARGE_ENABLED === 'true';
  if (serviceChargeEnabled) {
    const headerList = headers();
    const hostname = headerList.get('host') || '';
    let response: Response;

    try {
      response = await getUserPaymentStatus(hostname, session.token as string);
    } catch (error) {
      console.error('Error fetching payments', error);
      return redirect('/404');
    }

    const paymentReference = (await response.json()) as PaymentReference;
    serviceChargePaid = paymentReference.serviceChargePaid;
    const cookieStore = cookies();
    const serviceChargeGuidanceViewed = cookieStore.get(
      'serviceChargeGuidanceViewed',
    );

    // If service charge is not paid and they have not viewed the guidance,
    // redirect to the guidance page
    // TODO: Add check for data_admin role when user-roles are implemented
    if (!serviceChargePaid && !serviceChargeGuidanceViewed) {
      return redirect('/service-charge/guidance');
    }
  }

  const t = await getTranslations({ namespace: 'accountPage' });

  return (
    <Page>
      {!serviceChargePaid && (
        <GovUK.GridRow>
          <GovUK.GridCol>
            <GovUK.NotificationBanner title="Important">
              {t('serviceChargeBanner.one')}
              <Link className=" " href="/service-charge/guidance">
                {t('serviceChargeBanner.link')}
              </Link>
              {t('serviceChargeBanner.two')}
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
