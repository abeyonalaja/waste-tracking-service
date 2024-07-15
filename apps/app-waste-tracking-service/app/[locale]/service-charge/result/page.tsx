import { getTranslations } from 'next-intl/server';
import { getServerSession } from 'next-auth';
import { redirect } from '@wts/ui/navigation';
import { options } from '../../../api/auth/[...nextauth]/options';
import * as GovUK from '@wts/ui/govuk-react-ui';
import { Page } from '@wts/ui/shared-ui/server';
import { headers } from 'next/headers';
import process from 'node:process';
import { cookies } from 'next/headers';
import { PaymentRecord } from '@wts/api/payment';

export const metadata = {
  title: 'Pay the annual waste tracking service charge',
};

export default async function PaymentResultPage(): Promise<React.ReactNode> {
  const t = await getTranslations('charge.review');

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
    console.error(response);
    return redirect('/404');
  }

  const data: PaymentRecord = await response.json();
  //   console.log(data);

  return (
    <Page>
      <GovUK.GridRow>
        <GovUK.GridCol size="two-thirds">
          <GovUK.Heading>{t('headingOne')}</GovUK.Heading>
          <p>The payment was {data.state.status}</p>
        </GovUK.GridCol>
      </GovUK.GridRow>
    </Page>
  );
}
