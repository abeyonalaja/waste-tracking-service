'use client';
import { Page } from '@wts/frontend/shared-ui/server';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error }: ErrorPageProps) {
  // TODO: Add error page content and translation
  // Put in error recovery button

  console.error(error);

  return (
    <Page>
      <div>An error has occured</div>
    </Page>
  );
}
