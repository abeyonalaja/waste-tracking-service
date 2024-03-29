'use client';
import * as GovUK from '@wts/ui/govuk-react-ui';
import { signIn } from 'next-auth/react';

export default function SignInButton({ label }: { label: string }) {
  return (
    <GovUK.Button
      onClick={() => {
        signIn('defra-b2c');
      }}
    >
      {label}
    </GovUK.Button>
  );
}
