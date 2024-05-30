'use client';
import { useRouter } from '@wts/ui/navigation';
import { Button } from '@wts/ui/govuk-react-ui';
import { useState } from 'react';
import { useSearchParams } from 'next/navigation';

interface SubmitButtonsProps {
  buttonText: string;
  submissionId: string;
  token: string | null | undefined;
  secondary?: boolean;
}

export function SubmitButton({
  buttonText,
  submissionId,
  token,
  secondary = false,
}: SubmitButtonsProps): JSX.Element {
  const router = useRouter();
  const searchParams = useSearchParams();
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
    } catch (error) {
      console.error(error);
    }

    if (response!.status === 201) {
      router.push(
        `/multiples/${submissionId}?filename=${searchParams.get('filename')}`,
      );
    } else {
      router.push(`/404`);
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
