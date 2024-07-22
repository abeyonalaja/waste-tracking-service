import { getTranslations } from 'next-intl/server';
import { getServerSession } from 'next-auth';
import { redirect } from '@wts/ui/navigation';
import { options } from '../../../api/auth/[...nextauth]/options';
import { headers, cookies } from 'next/headers';
import process from 'node:process';
import type { PaymentRecord } from '@wts/api/payment';
import * as GovUK from '@wts/ui/govuk-react-ui';
import { Page } from '@wts/ui/shared-ui/server';
import {
  StatusChecker,
  formatExpiryDate,
  SuccessPageLink,
} from '@wts/app-waste-tracking-service/feature-service-charge';

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

  if (paymentRecord.state.status === 'Success' && paymentRecord.expiryDate) {
    return (
      <Page>
        <GovUK.GridRow>
          <GovUK.GridCol size="two-thirds">
            <GovUK.Panel title={t('success.panel.title')}>
              {t('success.panel.text')}
              <br />
              <strong>{paymentRecord.reference}</strong>
            </GovUK.Panel>
            <GovUK.Heading level={2} size="m">
              {t('success.body.headingOne')}
            </GovUK.Heading>
            <GovUK.Paragraph>
              {t.rich('success.body.content', {
                date: formatExpiryDate(paymentRecord.expiryDate),
                strong: (chunks) => <strong>{chunks}</strong>,
              })}
            </GovUK.Paragraph>
            <GovUK.Heading level={2} size="m" id="payment-summary">
              {t('success.body.headingTwo')}
            </GovUK.Heading>
            <table className="govuk-table" aria-labelledby="payment-summary">
              <tbody className="govuk-table__body">
                <tr className={`govuk-table__row`}>
                  <th
                    scope="row"
                    id="payment-for-label"
                    className={`govuk-table__header govuk-!-font-weight-regular govuk-!-width-one-half`}
                  >
                    {t('success.table.headingOne')}
                  </th>
                  <td
                    className={`govuk-table__cell govuk-!-width-one-half`}
                    id="payment-for-value"
                  >
                    {paymentRecord.description}
                  </td>
                </tr>
                <tr className={`govuk-table__row`}>
                  <th
                    scope="row"
                    id="payment-amount-label"
                    className={`govuk-table__header govuk-!-font-weight-regular`}
                  >
                    {t('success.table.headingTwo')}
                  </th>
                  <td id="payment-for-value" className={`govuk-table__cell`}>
                    {`£${(paymentRecord.amount / 100).toFixed(2)}`}
                  </td>
                </tr>
              </tbody>
            </table>
            <GovUK.Paragraph>
              <SuccessPageLink label={t('success.link')} />
            </GovUK.Paragraph>
          </GovUK.GridCol>
        </GovUK.GridRow>
      </Page>
    );
  }

  return (
    <Page>
      <GovUK.GridRow>
        <GovUK.GridCol size="full">
          <StatusChecker label={t('loading.title')} refreshInterval={3000} />
        </GovUK.GridCol>
      </GovUK.GridRow>
    </Page>
  );
}
