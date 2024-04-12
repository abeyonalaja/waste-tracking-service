import * as GovUK from '@wts/ui/govuk-react-ui';
import { LanguageSwitcher } from '../index';

interface PageProps {
  beforeChildren?: React.ReactNode;
  children: React.ReactNode;
}

export function Page({ beforeChildren, children }: PageProps) {
  return (
    <GovUK.WidthContainer>
      {beforeChildren && beforeChildren}
      <LanguageSwitcher />
      <GovUK.Main>{children}</GovUK.Main>
    </GovUK.WidthContainer>
  );
}
