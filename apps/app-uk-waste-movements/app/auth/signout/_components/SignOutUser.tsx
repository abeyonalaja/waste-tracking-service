'use client';
import { signOut } from 'next-auth/react';
import { useEffect } from 'react';

export default function SignOutUser(): JSX.Element {
  useEffect(() => {
    signOut({ redirect: false });
  }, []);
  return <></>;
}
