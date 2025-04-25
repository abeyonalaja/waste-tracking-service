import { useTranslation } from 'react-i18next';
import * as GovUK from 'govuk-react';
import { PageLayout } from 'features/multiples';
import { Paragraph } from 'components';

export default function SubmitErrorPage(): React.ReactNode {
  const { t } = useTranslation();
  return (
    <PageLayout setWidth="two-thirds">
      <GovUK.Heading size="L">
        {t('multiples.submit.error.title')}
      </GovUK.Heading>
      <Paragraph>{t('multiples.submit.error.paragraphOne')}</Paragraph>
      <Paragraph>{t('multiples.submit.error.paragraphTwo')}</Paragraph>
      <Paragraph>
        <span>
          {t('multiples.submit.error.paragraphThreeOne')}
          <GovUK.Link href="mailto:wasteuserresearch@defra.gov.uk">
            wasteuserresearch@defra.gov.uk
          </GovUK.Link>
          {t('multiples.submit.error.paragraphThreeTwo')}
        </span>
      </Paragraph>
    </PageLayout>
  );
}
