'use client';
import { useRouter } from '@wts/ui/navigation';
// import { useRouter } from 'next/navigation';
import { Button } from '@wts/ui/govuk-react-ui';
import { useState } from 'react';

interface SubmitButtonsProps {
  buttonText: string;
  submissionId: string;
  filename: string;
  token: string | null | undefined;
  secondary?: boolean;
}

export function SubmitButton({
  buttonText,
  submissionId,
  token,
  filename,
  secondary = false,
}: SubmitButtonsProps): JSX.Element {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    let response: Response;

    try {
      response = await fetch(
        `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/ukwm-batches/${submissionId}/finalize`,
        {
          method: 'POST',
          cache: 'no-store',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.status === 201) {
        return router.push(`/multiples/${submissionId}`);
      }
    } catch (error) {
      console.error(error);
      return router.push('/404');
    }

    if (response.status === 201) {
      return router.push(`/multiples/${submissionId}?filename=${filename}`);
    } else {
      return router.push('/404');
    }
  }
  return (
    <form onSubmit={handleSubmit}>
      <Button disabled={pending} secondary={secondary}>
        {buttonText}
      </Button>
    </form>
  );
}
