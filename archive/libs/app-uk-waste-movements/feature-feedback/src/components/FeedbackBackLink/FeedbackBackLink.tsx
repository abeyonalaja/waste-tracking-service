'use client';
import { useNewWindow, BackLink } from '@wts/ui/shared-ui';

interface FeedbackBackLinkProps {
  text?: string;
  href: string;
  routerBack?: boolean;
}
export function FeedbackBackLink({
  text,
  href,
  routerBack,
}: FeedbackBackLinkProps): JSX.Element | null {
  const isNewWindow = useNewWindow();
  if (isNewWindow) {
    return null;
  }
  return <BackLink text={text} href={href} routerBack={routerBack} />;
}
