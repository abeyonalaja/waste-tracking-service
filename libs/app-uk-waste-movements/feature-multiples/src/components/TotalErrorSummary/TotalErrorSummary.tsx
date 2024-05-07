'use client';

import * as GovUK from '@wts/ui/govuk-react-ui';
import { Link, useRouter } from '@wts/ui/navigation';

interface TotalErrorSummaryProps {
  strings: {
    heading: string;
    prompt: string;
    linkText: string;
  };
  href: string;
}

export function TotalErrorSummary({ strings, href }: TotalErrorSummaryProps) {
  const router = useRouter();

  return (
    <div className="govuk-error-summary" data-module="govuk-error-summary">
      <div role="alert">
        <GovUK.Heading size={'m'} level={2}>
          {strings.heading}
        </GovUK.Heading>
        <div className="govuk-error-summary__body">
          <p>{strings.prompt}</p>
          <ul className="govuk-list govuk-error-summary__list">
            <li>
              <Link
                href="#"
                onClick={(e: React.MouseEvent<HTMLElement>) => {
                  e.preventDefault();
                  router.replace(href);
                }}
                className="govuk-link"
              >
                {strings.linkText}
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
