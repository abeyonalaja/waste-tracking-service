import * as GovUK from '@wts/ui/govuk-react-ui';
import { useTranslations } from 'next-intl';

// Standard Next link is required here to navigate user to
// public folder to download template CSV file, bypassing locale
import Link from 'next/link';
import { Link as LocaleLink } from '@wts/ui/navigation';
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
            <LocaleLink href="/multiples/guidance" target="_blank">
              {t('createAndUpload.listItemOneLink')}
            </LocaleLink>
            {t('createAndUpload.listItemOnePartTwo')}
          </span>
        </GovUK.ListItem>
        <GovUK.ListItem>
          <span>
            {t('createAndUpload.listItemTwoPartOne')}
            <Link href="/downloads/multiple-movements-template.csv">
              {t('createAndUpload.listItemTwoLink')}
            </Link>
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
      <GovUK.GridRow mb={7}>
        <GovUK.GridCol size="one-quarter">
          <HTML />
        </GovUK.GridCol>
        <GovUK.GridCol size="two-thirds">
          <GovUK.Paragraph size="l" mb={2}>
            <LocaleLink href="/multiples/guidance" target="_blank">
              {t('documents.linkOne')}
            </LocaleLink>
          </GovUK.Paragraph>
          <GovUK.Paragraph size="s">HTML</GovUK.Paragraph>
        </GovUK.GridCol>
      </GovUK.GridRow>
      <GovUK.GridRow>
        <GovUK.GridCol size="one-quarter">
          <CSV />
        </GovUK.GridCol>
        <GovUK.GridCol size="three-quarters">
          <GovUK.Paragraph size="l" mb={2}>
            {t('documents.templateHeading')}
          </GovUK.Paragraph>
          <GovUK.Hint>{t('documents.templateDescription')}</GovUK.Hint>
          <GovUK.Paragraph>
            <Link href="/downloads/multiple-movements-template.csv">
              {t('documents.templateLink')}
            </Link>
          </GovUK.Paragraph>
        </GovUK.GridCol>
      </GovUK.GridRow>
    </>
  );
}
