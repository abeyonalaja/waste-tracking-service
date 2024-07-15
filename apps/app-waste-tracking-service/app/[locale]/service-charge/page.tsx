import { redirect } from 'next/navigation';
import * as process from 'node:process';
import { cookies, headers } from 'next/headers';
import { getUserPaymentStatus } from '@wts/app-waste-tracking-service/feature-service-charge';
import { getServerSession } from 'next-auth';
import { options } from '../../api/auth/[...nextauth]/options';
import { PaymentReference } from '@wts/api/waste-tracking-gateway';

export default async function ServiceCharge(): Promise<void> {
  const serviceChargeEnabled = process.env.SERVICE_CHARGE_ENABLED === 'true';
  if (!serviceChargeEnabled) {
    // Redirect to account page if service charge is not enabled
    redirect('/account');
  }

  const session = await getServerSession(options);
  const headerList = headers();
  const hostname = headerList.get('host') || '';
  let response: Response;
  try {
    response = await getUserPaymentStatus(hostname, session?.token as string);
  } catch (error) {
    console.error('Error fetching payments', error);
    return redirect('/404');
  }
  const { serviceChargePaid } = (await response.json()) as PaymentReference;
  if (serviceChargePaid) {
    // Redirect to account page if service charge is already paid
    redirect('/account');
  }

  const cookieStore = cookies();
  const serviceChargeGuidanceViewed = cookieStore.get(
    'serviceChargeGuidanceViewed',
  );

  if (serviceChargeGuidanceViewed) {
    // Redirect to review page if service charge is not paid and guidance has been viewed
    redirect('/service-charge/review');
  }

  // Redirect to guidance page if service charge is not paid and guidance has not been viewed
  redirect('/service-charge/guidance');
}
