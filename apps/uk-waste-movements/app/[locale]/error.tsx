'use client';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error }: ErrorPageProps) {
  // TODO: Add error page content and translation
  // Put in error recovery button

  console.error(error);

  return <div>An error has occured</div>;
}
