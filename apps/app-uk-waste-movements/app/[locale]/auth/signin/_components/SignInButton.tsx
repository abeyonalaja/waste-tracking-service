'use client';
import { signIn } from 'next-auth/react';
import { useEffect } from 'react';

export default function SignInButton() {
  useEffect(() => {
    signIn('defra-b2c');
  }, []);
  return <></>;
}
