'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loading } from '@wts/ui/shared-ui/server';
import * as GovUK from '@wts/ui/govuk-react-ui';
import styles from './StatusChecker.module.scss';

interface StatusCheckerProps {
  label: string;
  filename?: string;
}

export function StatusChecker({
  label,
  filename,
}: StatusCheckerProps): JSX.Element {
  const router = useRouter();

  useEffect(() => {
    const intervalId = setInterval(() => {
      router.refresh();
    }, 4000);

    return () => clearInterval(intervalId);
  }, [router]);

  return (
    <div className={styles.statusChecker}>
      <GovUK.Heading>
        {label} {filename}
      </GovUK.Heading>
      <Loading />
    </div>
  );
}
