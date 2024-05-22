import * as GovUK from '@wts/ui/govuk-react-ui';
import { useTranslations } from 'next-intl';
export function ProducerAndCollectionDetails(): React.ReactNode {
  const page = useTranslations(
    'multiples.guidancePageCSV.producerAndCollectionDetails'
  );
  const producerDetails = [
    {
      key: page('tableProducerDetails.producer'),
      value: <b>{page('tableProducerDetails.answerFormat')}</b>,
    },
    {
      key: page('tableProducerDetails.organisationName'),
      value: page('tableProducerDetails.organisationDescription'),
    },
    {
      key: page('tableProducerDetails.address'),
      value: page('tableProducerDetails.addressDescription'),
    },
    {
      key: page('tableProducerDetails.postcode'),
      value: page('tableProducerDetails.postcodeDescription'),
    },
    {
      key: page('tableProducerDetails.contactEmail'),
      value: (
        <>
          {page('tableProducerDetails.contactEmailDescription')}
          <a
            href={`mailto:${page('tableProducerDetails.contactEmailExample')}`}
            target="_blank"
            rel="noreferrer"
          >
            {page('tableProducerDetails.contactEmailExample')}
          </a>
        </>
      ),
    },
    {
      key: page('tableProducerDetails.contactPhone'),
      value: page('tableProducerDetails.contactPhoneDescription'),
    },
    {
      key: page('tableProducerDetails.sicCode'),
      value: (
        <>
          {page('tableProducerDetails.sitCodeDescriptionOne')}
          <a
            href="https://www.gov.uk/get-information-about-a-company"
            target="_blank"
            rel="noopener noreferrer"
          >
            {page('tableProducerDetails.sitCodeLink')}
          </a>
          {page('tableProducerDetails.sitCodeDescriptionTwo')}
        </>
      ),
    },
  ];
  const collectionDetails = [
    {
      key: page('tableCollectionDetails.collection'),
      value: <b>{page('tableCollectionDetails.answerFormat')}</b>,
    },
    {
      key: page('tableCollectionDetails.isProducerAddressSame'),
      value: page('tableCollectionDetails.isProducerAddressSameDescription'),
    },
    {
      key: page('tableCollectionDetails.collectionAddress'),
      value: page('tableCollectionDetails.collectionAddressDescription'),
    },
    {
      key: page('tableCollectionDetails.collectionPostcode'),
      value: page('tableCollectionDetails.collectionPostcodeDescription'),
    },
    {
      key: page('tableCollectionDetails.wasteSource'),
      value: page('tableCollectionDetails.wasteSourceDescription'),
    },
    {
      key: page('tableCollectionDetails.brokerRegistrationNumber'),
      value: page('tableCollectionDetails.brokerRegistrationNumberDescription'),
    },
    {
      key: page('tableCollectionDetails.carrierRegistrationNumber'),
      value: page(
        'tableCollectionDetails.carrierRegistrationNumberDescription'
      ),
    },
    {
      key: page('tableCollectionDetails.modeOfTransport'),
      value: (
        <>
          {page('tableCollectionDetails.modeOfTransportDescription')}
          <GovUK.List type="unordered">
            <GovUK.ListItem>
              {page('tableCollectionDetails.road')}
            </GovUK.ListItem>
            <GovUK.ListItem>
              {page('tableCollectionDetails.rail')}
            </GovUK.ListItem>
            <GovUK.ListItem>
              {page('tableCollectionDetails.sea')}
            </GovUK.ListItem>
            <GovUK.ListItem>
              {page('tableCollectionDetails.air')}
            </GovUK.ListItem>
            <GovUK.ListItem>
              {page('tableCollectionDetails.inlandWaterways')}
            </GovUK.ListItem>
          </GovUK.List>
        </>
      ),
    },
  ];
  return (
    <>
      <GovUK.Heading size="m" level={2} id="producerAndCollectionDetails">
        {page('heading')}
      </GovUK.Heading>
      <GovUK.Heading size="s" level={3}>
        {page('headingProducer')}
      </GovUK.Heading>
      <GovUK.Paragraph>{page('contentProducer')}</GovUK.Paragraph>
      <GovUK.SectionBreak size="m" visible={false} />
      <GovUK.SummaryList items={producerDetails} />
      <GovUK.SectionBreak size="m" visible={false} />
      <GovUK.Heading size="m" level={2} id="collectionDetails">
        {page('headingCollection')}
      </GovUK.Heading>
      <GovUK.SummaryList items={collectionDetails} />
      <GovUK.SectionBreak size="m" visible={false} />
    </>
  );
}
