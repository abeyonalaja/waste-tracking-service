import * as GovUK from '@wts/ui/govuk-react-ui';
import { useTranslations } from 'next-intl';
export function UniqueReference(): JSX.Element {
  const page = useTranslations('multiples.guidancePageCSV.uniqueReference');

  return (
    <>
      <GovUK.Heading size="m" id="yourUniqueReference">
        {page('heading')}
      </GovUK.Heading>
      <GovUK.Paragraph>{page('contentOne')}</GovUK.Paragraph>
      <GovUK.Paragraph>{page('contentTwo')}</GovUK.Paragraph>
      <GovUK.Paragraph>{page('contentThree')}</GovUK.Paragraph>
      <GovUK.Paragraph>{page('contentFour')}</GovUK.Paragraph>
      <GovUK.SectionBreak size="m" visible={false} />
    </>
  );
}
