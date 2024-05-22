'use client';
import { Link, useRouter } from '@wts/ui/navigation';

interface Props {
  text?: string;
  testId?: string;
  href: string;
  routerBack?: boolean;
}

export const BackLink = ({
  text = 'Back',
  testId,
  href,
  routerBack,
}: Props): JSX.Element => {
  const router = useRouter();
  return (
    <Link
      onClick={
        routerBack
          ? (e): void => {
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
