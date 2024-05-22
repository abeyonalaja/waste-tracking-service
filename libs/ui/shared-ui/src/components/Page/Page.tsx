import * as GovUK from '@wts/ui/govuk-react-ui';
import { LanguageSwitcher } from '../index';
import styles from './Page.module.scss';

interface PageProps {
  beforeChildren?: React.ReactNode;
  children: React.ReactNode;
}

export function Page({ beforeChildren, children }: PageProps): JSX.Element {
  return (
    <GovUK.WidthContainer>
      <div className={styles.navContainer}>
        {beforeChildren && beforeChildren}
        <LanguageSwitcher />
      </div>
      <GovUK.Main>{children}</GovUK.Main>
    </GovUK.WidthContainer>
  );
}
