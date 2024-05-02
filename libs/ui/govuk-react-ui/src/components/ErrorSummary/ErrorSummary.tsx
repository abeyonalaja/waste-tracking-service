'use client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
type Error = {
  text: string;
  href: string;
};
type ErrorSummaryProps = {
  id?: string;
  testId?: string;
  headingErrorText?: string;
  errors: Error[];
};

export const ErrorSummary = ({
  id = 'error-summary-box',
  testId,
  headingErrorText,
  errors,
}: ErrorSummaryProps) => {
  const router = useRouter();

  return (
    <div
      className="govuk-error-summary"
      data-module="govuk-error-summary"
      data-testid={testId}
      id={id}
    >
      <div role="alert">
        <h2 className="govuk-error-summary__title">{headingErrorText}</h2>
        <div className="govuk-error-summary__body">
          <ul className="govuk-list govuk-error-summary__list">
            {errors.map((error, index) => (
              <li key={index}>
                <Link
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    router.replace(error.href);
                  }}
                  className="govuk-link"
                >
                  {error.text}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
