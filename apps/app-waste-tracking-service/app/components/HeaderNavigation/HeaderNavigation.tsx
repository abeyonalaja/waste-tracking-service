'use client';
import { signIn, signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import styles from './HeaderNavigation.module.scss';

export function HeaderNavigation() {
  const { data: session } = useSession();

  if (session) {
    return (
      <nav className={styles.navigation}>
        <ul className={styles.list}>
          <li>{session?.user?.name}</li>
          <li>
            <Link
              href={''}
              onClick={() => signOut()}
              className="govuk-link govuk-link--inverse"
            >
              Sign out
            </Link>
          </li>
        </ul>
      </nav>
    );
  }
  return (
    <nav className={styles.navigation}>
      <ul className={styles.list}>
        <li>
          <Link
            href={''}
            onClick={() => signIn('defra-b2c')}
            className="govuk-link govuk-link--inverse"
          >
            Sign in
          </Link>
        </li>
      </ul>
    </nav>
  );
}
