import * as GovUK from '@wts/ui/govuk-react-ui';
import { useTranslations } from 'next-intl';
export function ReceiverDetails() {
  const page = useTranslations('multiples.guidancePageCSV.receiverDetails');

  return (
    <>
      <GovUK.Heading size="m" level={2} id="receiverDetails">
        {page('heading')}
      </GovUK.Heading>
      <GovUK.Paragraph>{page('description')}</GovUK.Paragraph>

      <GovUK.Heading size="s" level={3}>
        {page('contentHeadingOne')}
      </GovUK.Heading>
      <GovUK.Paragraph>
        {page('contentDescriptionOne')}
        <a
          href="https://environment.data.gov.uk/public-register/view/search-waste-operations"
          target="_blank"
          rel="noreferrer"
        >
          {page('contentLinkOne')}
        </a>
        .
      </GovUK.Paragraph>

      <GovUK.Heading size="s" level={3}>
        {page('contentHeadingTwo')}
      </GovUK.Heading>
      <GovUK.Paragraph>
        {page('contentDescriptionTwo')}
        <a
          href="https://environment.data.gov.uk/public-register/view/search-waste-exemptions"
          target="_blank"
          rel="noreferrer"
        >
          {page('contentLinkTwo')}
        </a>
        .
      </GovUK.Paragraph>

      <GovUK.Heading size="s" level={3}>
        {page('contentHeadingThree')}
      </GovUK.Heading>
      <GovUK.Paragraph>{page('contentDescriptionThree')}</GovUK.Paragraph>

      <GovUK.Heading size="s" level={3}>
        {page('contentHeadingFour')}
      </GovUK.Heading>
      <GovUK.Paragraph>{page('contentDescriptionFour')}</GovUK.Paragraph>

      <GovUK.Heading size="s" level={3}>
        {page('contentHeadingFive')}
      </GovUK.Heading>
      <GovUK.Paragraph>{page('contentDescriptionFive')}</GovUK.Paragraph>
      <GovUK.SectionBreak size="m" visible={false} />
    </>
  );
}
