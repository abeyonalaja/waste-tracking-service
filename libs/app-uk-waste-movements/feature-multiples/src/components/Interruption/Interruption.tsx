import * as GovUK from '@wts/ui/govuk-react-ui';
import styles from './Interruption.module.scss';
import { useTranslations } from 'next-intl';
import { InterruptionButton } from '../InterruptionButton';
import { Link } from '@wts/ui/navigation';
import { HTML } from '@wts/ui/shared-ui/server';

export function Interruption() {
  const strings = useTranslations('multiples.interruption');

  return (
    <div className={styles.interruption}>
      <GovUK.Heading size="xl">{strings('heading')}</GovUK.Heading>
      <GovUK.Paragraph>{strings('paragraphOne')}</GovUK.Paragraph>
      <GovUK.Paragraph mb={5}>{strings('paragraphTwo')}</GovUK.Paragraph>
      <div className={styles.row}>
        <HTML />
        <div>
          <GovUK.Paragraph size="l" mb={1}>
            <Link
              href="/multiples/guidance"
              target="_blank"
              className={'govuk-link--inverse'}
            >
              {strings('link')}
            </Link>
          </GovUK.Paragraph>
          <GovUK.Paragraph size="s" mb={1}>
            HTML
          </GovUK.Paragraph>
        </div>
      </div>
      <InterruptionButton label={strings('button')} />
    </div>
  );
}
