'use client';
import { signIn } from 'next-auth/react';
import Link from 'next/link';

export function SignInLink(): JSX.Element {
  return (
    <Link
      href="#"
      onClick={(e) => {
        e.preventDefault();
        signIn('defra-b2c');
      }}
      className="govuk-link govuk-link--inverse"
    >
      Sign in
    </Link>
  );
}
