import { useTranslations } from 'next-intl';
import * as GovUK from '@wts/ui/govuk-react-ui';

export const metadata = {
  title: 'UK waste movements',
};

export default function Index() {
  const t = useTranslations('startPage');
  return (
    <>
      <GovUK.GridRow>
        <GovUK.GridCol size={'two-thirds'}>
          <GovUK.Heading size={'l'} level={1}>
            {t('title')}
          </GovUK.Heading>
          <GovUK.Paragraph size={'l'}>{t('description')}</GovUK.Paragraph>
          <GovUK.Paragraph> {t('serviceFeatures.description')}</GovUK.Paragraph>
          <GovUK.List type="unordered">
            <GovUK.ListItem>
              {t('serviceFeatures.listElementOne')}
            </GovUK.ListItem>
            <GovUK.ListItem>
              {t('serviceFeatures.listElementTwo')}
            </GovUK.ListItem>
            <GovUK.ListItem>
              {t('serviceFeatures.listElementThree')}
            </GovUK.ListItem>
            <GovUK.ListItem>
              {t('serviceFeatures.listElementFour')}
            </GovUK.ListItem>
          </GovUK.List>
          <GovUK.Button start={true} text={t('buttonStartNow')} />
          <GovUK.Heading size={'m'} level={2}>
            {t('beforeYouStart.title')}
          </GovUK.Heading>
          <GovUK.Paragraph>
            {t('beforeYouStart.descriptionOne')}
          </GovUK.Paragraph>
          <GovUK.List type={'ordered'}>
            <GovUK.ListItem>
              {' '}
              {t('beforeYouStart.listElementOne')}
            </GovUK.ListItem>
            <GovUK.ListItem>
              {t('beforeYouStart.listElementTwo')}
            </GovUK.ListItem>
          </GovUK.List>
          <GovUK.Paragraph>
            {t('beforeYouStart.descriptionTwo')}
          </GovUK.Paragraph>
          <GovUK.List type={'unordered'}>
            <GovUK.ListItem>
              {t('beforeYouStart.unorderedListElementOne')}
            </GovUK.ListItem>
            <GovUK.ListItem>
              {t('beforeYouStart.unorderedListElementTwo')}
            </GovUK.ListItem>
          </GovUK.List>
          <GovUK.InsetText>{t('beforeYouStart.insetText')}</GovUK.InsetText>
          <GovUK.Paragraph>
            {t('beforeYouStart.descriptionThree')}
          </GovUK.Paragraph>
          <GovUK.Paragraph>
            {t('beforeYouStart.descriptionFour')}
          </GovUK.Paragraph>
          <GovUK.Heading size={'m'} level={3}>
            {t('wasteMovementControls.title')}
          </GovUK.Heading>
          <GovUK.Paragraph>
            {t('wasteMovementControls.description')}
          </GovUK.Paragraph>
          <GovUK.Heading size={'m'} level={3}>
            {t('exportImportControls.title')}
          </GovUK.Heading>
          <GovUK.Paragraph>
            {t('exportImportControls.descriptionOne')}
          </GovUK.Paragraph>
          <GovUK.Paragraph>
            {t('exportImportControls.descriptionTwo')}
          </GovUK.Paragraph>
          <GovUK.List type="unordered">
            <GovUK.ListItem>
              <GovUK.Link href="#">
                {t('exportImportControls.linkOne')}
              </GovUK.Link>
            </GovUK.ListItem>
            <GovUK.ListItem>
              <GovUK.Link href="#">
                {t('exportImportControls.linkTwo')}
              </GovUK.Link>
            </GovUK.ListItem>
            <GovUK.ListItem>
              <GovUK.Link href="#">
                {t('exportImportControls.linkThree')}
              </GovUK.Link>
            </GovUK.ListItem>
            <GovUK.ListItem>
              <GovUK.Link href="#">
                {t('exportImportControls.linkFour')}
              </GovUK.Link>
            </GovUK.ListItem>
          </GovUK.List>
          <GovUK.Heading size={'m'} level={3}>
            {t('getHelpTechnicalIssue.title')}
          </GovUK.Heading>
          <GovUK.Paragraph>
            {t('getHelpTechnicalIssue.descriptionOne')}
          </GovUK.Paragraph>
          <GovUK.Paragraph>
            {t('getHelpTechnicalIssue.emailKey')}{' '}
            <GovUK.Link href="#">
              {t('getHelpTechnicalIssue.emailValue')}
            </GovUK.Link>
          </GovUK.Paragraph>
          <GovUK.Paragraph>
            {t('getHelpTechnicalIssue.descriptionTwo')}
          </GovUK.Paragraph>
          <GovUK.Heading size={'m'} level={3}>
            {t('getHelpRegulatoryIssue.title')}
          </GovUK.Heading>
          <GovUK.Paragraph>
            {t('getHelpRegulatoryIssue.descriptionOne')}
          </GovUK.Paragraph>
          <GovUK.Paragraph>
            {t('getHelpRegulatoryIssue.descriptionTwo')}
          </GovUK.Paragraph>
          <GovUK.List type="unordered">
            <GovUK.ListItem>
              <GovUK.Link href="#">
                {t('getHelpRegulatoryIssue.linkOne')}
              </GovUK.Link>
            </GovUK.ListItem>
            <GovUK.ListItem>
              <GovUK.Link href="#">
                {t('getHelpRegulatoryIssue.linkTwo')}
              </GovUK.Link>
            </GovUK.ListItem>
            <GovUK.ListItem>
              <GovUK.Link href="#">
                {t('getHelpRegulatoryIssue.linkThree')}
              </GovUK.Link>
            </GovUK.ListItem>
            <GovUK.ListItem>
              <GovUK.Link href="#">
                {t('getHelpRegulatoryIssue.linkFour')}
              </GovUK.Link>
            </GovUK.ListItem>
          </GovUK.List>
        </GovUK.GridCol>
      </GovUK.GridRow>
    </>
  );
}
