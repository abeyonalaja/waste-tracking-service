import * as GovUK from '@wts/ui/govuk-react-ui';
import { useTranslations } from 'next-intl';
export function EWC(): React.ReactNode {
  const page = useTranslations(
    'multiples.guidancePageCSV.ewcCodesAndDescription'
  );
  const producerDetails = [
    {
      key: page('descriptionOfTheWaste.wasteQuantityDetails.heading'),
      value: (
        <b>{page('descriptionOfTheWaste.wasteQuantityDetails.answerFormat')}</b>
      ),
    },
    {
      key: page('descriptionOfTheWaste.wasteQuantityDetails.wasteQuantity'),
      value: page(
        'descriptionOfTheWaste.wasteQuantityDetails.wasteQuantityDescription'
      ),
    },
    {
      key: page(
        'descriptionOfTheWaste.wasteQuantityDetails.wasteQuantityUnits'
      ),
      value: page(
        'descriptionOfTheWaste.wasteQuantityDetails.wasteQuantityUnitsDescription'
      ),
    },
    {
      key: page(
        'descriptionOfTheWaste.wasteQuantityDetails.estimatedOrActualQuantity'
      ),
      value: page(
        'descriptionOfTheWaste.wasteQuantityDetails.estimatedOrActualQuantityDescription'
      ),
    },
  ];
  return (
    <>
      <GovUK.Heading size="m" level={2} id="ewcCodesAndDescription">
        {page('heading')}
      </GovUK.Heading>

      <GovUK.Paragraph>
        {page('contentOne')}
        <a
          href="https://www.gov.uk/how-to-classify-different-types-of-waste"
          target="_blank"
          rel="noopener noreferrer"
        >
          {page('contentLink')}
        </a>
        {page('contentTwo')}
      </GovUK.Paragraph>

      <GovUK.Paragraph>{page('contentThree')}</GovUK.Paragraph>

      <GovUK.Heading size="s" level={3}>
        {page('codes.heading')}
      </GovUK.Heading>
      <GovUK.Paragraph>{page('codes.content')}</GovUK.Paragraph>
      <GovUK.SectionBreak size="m" visible={false} />
      <GovUK.Heading size="s" level={3}>
        {page('descriptionOfTheWaste.headingOne')}
      </GovUK.Heading>

      <GovUK.Heading size="s" level={3}>
        {page('descriptionOfTheWaste.headingTwo')}
      </GovUK.Heading>
      <GovUK.Paragraph>
        {page('descriptionOfTheWaste.contentOne')}
      </GovUK.Paragraph>
      <GovUK.Paragraph>
        {page('descriptionOfTheWaste.contentTwo')}
      </GovUK.Paragraph>
      <GovUK.SectionBreak size="m" visible={false} />
      <GovUK.Heading size="s" level={3}>
        {page('descriptionOfTheWaste.headingThree')}
      </GovUK.Heading>
      <GovUK.Paragraph>
        {page('descriptionOfTheWaste.contentThree')}
      </GovUK.Paragraph>

      <GovUK.List type="unordered">
        <GovUK.ListItem>{page('descriptionOfTheWaste.gas')}</GovUK.ListItem>
        <GovUK.ListItem>{page('descriptionOfTheWaste.liquid')}</GovUK.ListItem>
        <GovUK.ListItem>{page('descriptionOfTheWaste.solid')}</GovUK.ListItem>
        <GovUK.ListItem>{page('descriptionOfTheWaste.powder')}</GovUK.ListItem>
        <GovUK.ListItem>{page('descriptionOfTheWaste.sludge')}</GovUK.ListItem>
        <GovUK.ListItem>{page('descriptionOfTheWaste.mixed')}</GovUK.ListItem>
      </GovUK.List>
      <GovUK.SectionBreak size="m" visible={false} />
      <GovUK.Heading size="s" level={3}>
        {page('descriptionOfTheWaste.headingQuantity')}
      </GovUK.Heading>
      <GovUK.SummaryList items={producerDetails} />
      <GovUK.SectionBreak size="m" visible={false} />
      <GovUK.Heading size="s" level={3}>
        {page('descriptionOfTheWaste.headingFour')}
      </GovUK.Heading>
      <GovUK.Paragraph>
        {page('descriptionOfTheWaste.contentFour')}
        <a
          href="https://www.gov.uk/dispose-hazardous-waste"
          target="_blank"
          rel="noopener noreferrer"
        >
          {page('descriptionOfTheWaste.contentLink')}
        </a>
        .
      </GovUK.Paragraph>

      <GovUK.Heading size="s" level={3}>
        {page('descriptionOfTheWaste.headingFive')}
      </GovUK.Heading>
      <GovUK.Paragraph>
        {page('descriptionOfTheWaste.contentFive')}
        <a
          href="https://www.gov.uk/guidance/using-persistent-organic-pollutants-pops"
          target="_blank"
          rel="noopener noreferrer"
        >
          {page('descriptionOfTheWaste.contentLinkTwo')}
        </a>
        {page('descriptionOfTheWaste.contentFiveFinal')}
      </GovUK.Paragraph>
    </>
  );
}
