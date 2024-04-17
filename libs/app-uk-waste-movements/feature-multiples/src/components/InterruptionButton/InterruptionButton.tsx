'use client';
import { useCookies } from 'react-cookie';
import { useRouter } from '@wts/ui/navigation';
import * as GovUK from '@wts/ui/govuk-react-ui';

interface InterruptionButtonProps {
  label: string;
}

export function InterruptionButton({ label }: InterruptionButtonProps) {
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [cookies, setCookie] = useCookies();

  const expiryDate = new Date();
  const currentDate = expiryDate.getDate();
  expiryDate.setMonth(expiryDate.getMonth() + 1);

  if (expiryDate.getDate() < currentDate) {
    expiryDate.setDate(0);
  }

  function acknowledgeGuidance() {
    setCookie('UKWMMultipleGuidanceViewed', true, {
      expires: expiryDate,
      path: '/',
    });
    router.refresh();
  }

  return (
    <GovUK.Button inverse={true} onClick={() => acknowledgeGuidance()}>
      {label}
    </GovUK.Button>
  );
}
