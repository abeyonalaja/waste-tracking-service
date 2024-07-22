import { getTranslations } from 'next-intl/server';
import { getServerSession } from 'next-auth';
import { options } from '../../../api/auth/[...nextauth]/options';
import { getUserPaymentStatus } from '@wts/app-waste-tracking-service/feature-service-charge';
import { headers } from 'next/headers';
import process from 'node:process';
import type { PaymentReference } from '@wts/api/waste-tracking-gateway';
import styles from './page.module.css';
import * as GovUK from '@wts/ui/govuk-react-ui';
import { Page } from '@wts/ui/shared-ui/server';
import { Link, redirect } from '@wts/ui/navigation';
import {
  PaymentContinueButton,
  formatExpiryDate,
} from '@wts/app-waste-tracking-service/feature-service-charge';

export const metadata = {
  title: 'Pay the annual waste tracking service charge',
};

export default async function ReviewPaymentPage(): Promise<React.ReactNode> {
  const t = await getTranslations('charge.review');
  const serviceChargeEnabled = process.env.SERVICE_CHARGE_ENABLED === 'true';
  const returnUrlbase = process.env.NEXTAUTH_URL;
  const apiUrl = process.env.NEXT_PUBLIC_API_GATEWAY_URL;

  if (!serviceChargeEnabled) {
    redirect('/account');
  }
  const session = await getServerSession(options);

  if (!session || session.token === undefined || session.token === null) {
    console.error('No session or token present');
    return redirect('/404');
  }
  if (!returnUrlbase || !apiUrl) {
    console.error('No return URL or API present');
    return redirect('/404');
  }

  const headerList = headers();
  const hostname = headerList.get('host') || '';
  let response: Response;

  try {
    response = await getUserPaymentStatus(hostname, session?.token as string);
  } catch (error) {
    console.error(error);
    return redirect('/404');
  }
  const { renewalDate } = (await response.json()) as PaymentReference;

  return (
    <Page>
      <GovUK.GridRow>
        <GovUK.GridCol size="two-thirds">
          <GovUK.Caption size="xl">{t('caption')}</GovUK.Caption>
          <GovUK.Heading>{t('headingOne')}</GovUK.Heading>
          <GovUK.Paragraph>
            {t.rich('paragraphOne', {
              date: formatExpiryDate(renewalDate),
              strong: (chunks) => <strong>{chunks}</strong>,
            })}
          </GovUK.Paragraph>
          <GovUK.Heading level={2} size="m" id="payment-amount">
            {t('headingTwo')}
          </GovUK.Heading>
          <table className="govuk-table" aria-labelledby="payment-amount">
            <tbody className="govuk-table__body">
              <tr className={`govuk-table__row ${styles.tableRow}`}>
                <th
                  scope="row"
                  className={`govuk-table__header ${styles.tableHeader}`}
                >
                  {t('tableHeading')}
                </th>
                <td className={`govuk-table__cell ${styles.tableData}`}>
                  {`£20.00`}
                </td>
              </tr>
            </tbody>
          </table>
          <GovUK.ButtonGroup>
            <PaymentContinueButton
              label={t('buttonAction')}
              token={session.token}
              returnUrl={`${returnUrlbase}/service-charge/result`}
              apiUrl={apiUrl}
            />
            <Link href="/account" className="govuk-link">
              {t('buttonCancel')}
            </Link>
          </GovUK.ButtonGroup>
        </GovUK.GridCol>
      </GovUK.GridRow>
    </Page>
  );
}
