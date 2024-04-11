import { Link } from '@wts/frontend/navigation';

type Props = {
  text?: string;
  testId?: string;
  href: string;
};

export const BackLink = ({ text = 'Back', testId, href }: Props) => {
  return (
    <Link href={href} className={`govuk-back-link`} data-testid={testId}>
      {text}
    </Link>
  );
};
