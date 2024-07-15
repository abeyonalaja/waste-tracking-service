'use client';

import { CreatedPayment } from '@wts/api/payment';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import * as GovUK from '@wts/ui/govuk-react-ui';

interface PaymentContinueButtonProps {
  label: string;
  token: string;
  returnUrl: string;
  apiUrl: string;
}

export function PaymentContinueButton({
  label,
  token,
  returnUrl,
  apiUrl,
}: PaymentContinueButtonProps): JSX.Element {
  const [enabled, setEnabled] = useState(true);
  const router = useRouter();

  async function handleClick(): Promise<void> {
    setEnabled(false);
    let response: Response;

    const body = {
      returnUrl,
      amount: 2000,
      description: 'Waste tracking service',
    };

    try {
      response = await fetch(`${apiUrl}/payments`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        console.error(response);
        setEnabled(true);
        return;
      }

      const data: {
        id: CreatedPayment['id'];
        redirectUrl: CreatedPayment['redirectUrl'];
      } = await response.json();

      document.cookie = `referenceId=${data.id}; secure; SameSite=Strict;`;
      router.push(data.redirectUrl);
    } catch (error) {
      console.error(error);
      setEnabled(true);
    }
  }

  return (
    <GovUK.Button onClick={handleClick} disabled={!enabled}>
      {label}
    </GovUK.Button>
  );
}
