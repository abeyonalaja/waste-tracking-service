'use client';
import { Link, useRouter } from '@wts/ui/navigation';

type Props = {
  text?: string;
  testId?: string;
  href: string;
  routerBack?: boolean;
};

export const BackLink = ({
  text = 'Back',
  testId,
  href,
  routerBack,
}: Props) => {
  const router = useRouter();
  return (
    <Link
      onClick={
        routerBack
          ? (e) => {
              e.preventDefault();
              router.back();
            }
          : undefined
      }
      href={href}
      className={`govuk-back-link`}
      data-testid={testId}
    >
      {text}
    </Link>
  );
};
