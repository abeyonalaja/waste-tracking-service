import * as GovUK from '@wts/ui/govuk-react-ui';
import { useTranslations } from 'next-intl';
import styles from './Instructions.module.scss';
import { Link } from '@wts/ui/navigation';
import { HTML, CSV } from '@wts/ui/shared-ui/server';

export function Instructions() {
  const t = useTranslations('multiples.instructions');

  return (
    <>
      <GovUK.Heading size={'m'} level={2}>
        {t('createAndUpload.heading')}
      </GovUK.Heading>
      <GovUK.List type="ordered">
        <GovUK.ListItem>
          <span>
            {t('createAndUpload.listItemOnePartOne')}
            <Link href="/multiples/guidance" target="_blank">
              {t('createAndUpload.listItemOneLink')}
            </Link>
            {t('createAndUpload.listItemOnePartTwo')}
          </span>
        </GovUK.ListItem>
        <GovUK.ListItem>
          <span>
            {t('createAndUpload.listItemTwoPartOne')}

            <a
              href={
                process.env['NODE_ENV'] === 'production'
                  ? '/move-waste/downloads/multiple-movements-template.csv'
                  : '/downloads/multiple-movements-template.csv'
              }
            >
              {t('createAndUpload.listItemTwoLink')}
            </a>
            {t('createAndUpload.listItemTwoPartTwo')}
          </span>
        </GovUK.ListItem>
        <GovUK.ListItem>{t('createAndUpload.listItemThree')}</GovUK.ListItem>
        <GovUK.ListItem>{t('createAndUpload.listItemFour')}</GovUK.ListItem>
        <GovUK.ListItem>{t('createAndUpload.listItemFive')}</GovUK.ListItem>
      </GovUK.List>
      <GovUK.SectionBreak size="l" />
      <GovUK.Heading size={'m'} level={2}>
        {t('documents.heading')}
      </GovUK.Heading>

      <div className={styles.row}>
        <HTML />
        <div>
          <GovUK.Paragraph size="l" mb={2}>
            <Link href="/multiples/guidance" target="_blank">
              {t('documents.linkOne')}
            </Link>
          </GovUK.Paragraph>
          <GovUK.Paragraph size="s">HTML</GovUK.Paragraph>
        </div>
      </div>
      <div className={styles.row}>
        <CSV />
        <div>
          <GovUK.Paragraph size="l" mb={2}>
            {t('documents.templateHeading')}
          </GovUK.Paragraph>
          <GovUK.Hint>{t('documents.templateDescription')}</GovUK.Hint>
          <GovUK.Paragraph>
            <a
              href={
                process.env['NODE_ENV'] === 'production'
                  ? '/move-waste/downloads/multiple-movements-template.csv'
                  : '/downloads/multiple-movements-template.csv'
              }
            >
              {t('documents.templateLink')}
            </a>
          </GovUK.Paragraph>
        </div>
      </div>
    </>
  );
}
