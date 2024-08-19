'use client';

import { useState } from 'react';
import * as GovUK from '@wts/ui/govuk-react-ui';
import { useRouter } from 'next/navigation';
import type { UkwmAddress } from '@wts/api/waste-tracking-gateway';

interface formStrings {
  buttonOne: string;
  buttonTwo: string;
}

interface ReuseProducerAddressConfirmProps {
  id: string;
  token: string;
  address: UkwmAddress;
  formStrings: formStrings;
}

export function ReuseProducerAddressConfirm({
  id,
  token,
  address,
  formStrings,
}: ReuseProducerAddressConfirmProps): React.ReactNode {
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const router = useRouter();

  async function handleSubmit(
    event:
      | React.FormEvent<HTMLFormElement>
      | React.MouseEvent<HTMLButtonElement>,
    submitType: 'continueToNextPage' | 'returnToTaskList',
  ): Promise<void> {
    event.preventDefault();
    setButtonDisabled(true);

    let response: Response;
    const saveAsDraft = submitType === 'returnToTaskList';

    try {
      response = await fetch(
        `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/ukwm/drafts/${id}/waste-collection-address?saveAsDraft=${saveAsDraft}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(address),
        },
      );

      if (!response.ok) {
        console.error('Failed to PUT collection address', response);
        return router.push('/error');
      }

      if (submitType === 'continueToNextPage') {
        window.location.assign(`/single/${id}/producer/source`);
        return;
      } else {
        window.location.assign(`/single/${id}`);
        return;
      }
    } catch (error) {
      console.error('Failed to PUT collection address', error);
      return router.push('/error');
    }
  }

  return (
    <form
      onSubmit={(e: React.FormEvent<HTMLFormElement>) =>
        handleSubmit(e, 'continueToNextPage')
      }
    >
      <GovUK.ButtonGroup>
        <GovUK.Button type="submit" disabled={buttonDisabled}>
          {formStrings.buttonOne}
        </GovUK.Button>
        <button
          disabled={buttonDisabled}
          onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
            handleSubmit(e, 'returnToTaskList')
          }
          className="govuk-button govuk-button--secondary"
        >
          {formStrings.buttonTwo}
        </button>
      </GovUK.ButtonGroup>
    </form>
  );
}
