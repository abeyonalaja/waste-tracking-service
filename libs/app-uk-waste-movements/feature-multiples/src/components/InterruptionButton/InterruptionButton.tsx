'use client';
import { useCookies } from 'react-cookie';
import { useRouter } from 'next/navigation';
import * as GovUK from '@wts/ui/govuk-react-ui';
import { add } from 'date-fns';

interface InterruptionButtonProps {
  label: string;
}

export function InterruptionButton({
  label,
}: InterruptionButtonProps): JSX.Element {
  const router = useRouter();
  const [, setCookie] = useCookies();

  const expiryDate = add(new Date(), {
    months: 1,
  });

  function acknowledgeGuidance(): void {
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
