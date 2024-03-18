'use client';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error }: ErrorPageProps) {
  // TODO: Add error page content and translation
  // Put in error recovery button

  console.error(error);

  return (
    <>
      <h1 className="govuk-heading-l">
        Sorry, there is a problem with the service
      </h1>
      <p>Try again later.</p>
      <p>
        We saved your answers. They will be available when you can access the
        service again.
      </p>
    </>
  );
}
