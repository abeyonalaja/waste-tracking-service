import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export default function ServiceCharge(): void {
  const serviceChargeEnabled = process.env.SERVICE_CHARGE_ENABLED === 'true';
  if (!serviceChargeEnabled) {
    redirect('/account');
  }

  const cookieStore = cookies();
  const serviceChargeGuidanceViewed = cookieStore.get(
    'serviceChargeGuidanceViewed',
  );

  if (serviceChargeGuidanceViewed) {
    return redirect('/service-charge/review');
  }

  return redirect('/service-charge/guidance');
}
