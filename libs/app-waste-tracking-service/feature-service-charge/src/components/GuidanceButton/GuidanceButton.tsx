'use client';
import React, { ReactNode } from 'react';
import { useRouter } from '@wts/ui/navigation';
import * as GovUK from '@wts/ui/govuk-react-ui';
import { add } from 'date-fns';

interface GuidanceButtonProps {
  children: ReactNode;
}

export function GuidanceButton({
  children,
}: GuidanceButtonProps): React.JSX.Element {
  const router = useRouter();
  const expiryDate = add(new Date(), {
    years: 1,
  });

  // Only when CSR set a cookie to remember that the user has
  // viewed the guidance for use on account homepage payment check
  if (typeof window !== 'undefined') {
    document.cookie = `serviceChargeGuidanceViewed=true; expires=${expiryDate.toUTCString()}; path=/`;
  }

  function handleClick(): void {
    window.scrollTo(0, 0);
    return router.push('/service-charge/review');
  }

  return <GovUK.Button onClick={handleClick}>{children}</GovUK.Button>;
}
