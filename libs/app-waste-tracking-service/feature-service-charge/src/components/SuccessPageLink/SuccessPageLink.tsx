'use client';

import { Link, useRouter } from '@wts/ui/navigation';

interface SuccessPageLinkProps {
  label: string;
}
export function SuccessPageLink({
  label,
}: SuccessPageLinkProps): React.ReactNode {
  const router = useRouter();

  // Router refresh required to clear next-client browser cache
  // of account homepage in order to remove payment banner
  return (
    <Link
      href="/account"
      className={'govuk-link govuk-link--no-visited-state'}
      onClick={(e: React.MouseEvent) => {
        e.preventDefault();
        window.scrollTo(0, 0);
        router.push('/account');
        router.refresh();
      }}
    >
      {label}
    </Link>
  );
}
