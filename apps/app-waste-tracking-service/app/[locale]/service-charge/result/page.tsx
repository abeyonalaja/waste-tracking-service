import { getTranslations } from 'next-intl/server';
import { getServerSession } from 'next-auth';
import { redirect } from '@wts/ui/navigation';
import { options } from '../../../api/auth/[...nextauth]/options';
import { Page } from '@wts/ui/shared-ui/server';
import { headers } from 'next/headers';
import process from 'node:process';
import { cookies } from 'next/headers';
import type { PaymentRecord } from '@wts/api/payment';
import * as GovUK from '@wts/ui/govuk-react-ui';
import { StatusChecker } from '@wts/app-waste-tracking-service/feature-service-charge';

export const metadata = {
  title: 'Pay the annual waste tracking service charge',
};

export default async function PaymentResultPage(): Promise<React.ReactNode> {
  const t = await getTranslations('charge.result');

  // Redirect to account page if service charge is not enabled
  const serviceChargeEnabled = process.env.SERVICE_CHARGE_ENABLED === 'true';
  if (!serviceChargeEnabled) {
    redirect('/account');
  }

  // Redirect user if no payment ID is present
  const referenceId = cookies().get('referenceId');
  if (referenceId === undefined) {
    console.error('No payment ID present');
    return redirect('/404');
  }

  // Redirect user if not logged in with an active session
  const session = await getServerSession(options);
  if (!session || session.token === undefined || session.token === null) {
    console.error('No session or token present');
    return redirect('/404');
  }

  let protocol = 'https';
  const headerList = headers();
  let hostname = headerList.get('host') || '';

  if (hostname.indexOf('localhost') === 0) {
    hostname = 'localhost:3000';
    protocol = 'http';
  }

  const apiUrl = `${protocol}://${hostname}/api`;
  let response: Response;

  try {
    response = await fetch(`${apiUrl}/payments/${referenceId.value}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${session.token}`,
      },
    });
  } catch (error) {
    console.error(error);
    return redirect('/404');
  }

  if (!response.ok) {
    console.error('Error fetching payment record');
    return redirect('/404');
  }

  const paymentRecord: PaymentRecord = await response.json();

  if (
    paymentRecord.state.status === 'Rejected' ||
    paymentRecord.state.status === 'CancelledByService' ||
    paymentRecord.state.status === 'CancelledByUser' ||
    paymentRecord.state.status === 'SessionExpired' ||
    paymentRecord.state.status === 'Error'
  ) {
    return redirect('/account');
  }

  if (paymentRecord.state.status === 'Success') {
    return (
      <Page>
        <GovUK.GridRow>
          <GovUK.GridCol size="two-thirds">
            <p>The payment record reference is {paymentRecord.reference}</p>
          </GovUK.GridCol>
        </GovUK.GridRow>
      </Page>
    );
  }

  return (
    <Page>
      <GovUK.GridRow>
        <GovUK.GridCol size="full">
          <StatusChecker label={t('loadingTitle')} refreshInterval={3000} />
        </GovUK.GridCol>
      </GovUK.GridRow>
    </Page>
  );
}
