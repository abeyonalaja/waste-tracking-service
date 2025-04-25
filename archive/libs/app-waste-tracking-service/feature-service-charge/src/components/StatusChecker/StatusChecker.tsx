'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loading } from '@wts/ui/shared-ui/server';
import * as GovUK from '@wts/ui/govuk-react-ui';
import styles from './StatusChecker.module.scss';

interface StatusCheckerProps {
  label: string;
  refreshInterval?: number;
}

export function StatusChecker({
  label,
  refreshInterval,
}: StatusCheckerProps): JSX.Element {
  const router = useRouter();

  useEffect(() => {
    // Skips refreshing for use on Loading.tsx page
    if (!refreshInterval) {
      return;
    }

    const intervalId = setInterval(() => {
      router.refresh();
    }, refreshInterval);

    return () => clearInterval(intervalId);
  }, [router, refreshInterval]);

  return (
    <div className={styles.statusChecker}>
      <GovUK.Heading>{label}</GovUK.Heading>
      <Loading />
    </div>
  );
}
