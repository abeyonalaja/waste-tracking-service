'use client';

import {
  Button,
  ButtonGroup,
  Caption,
  Heading,
  SectionBreak,
  SummaryCard,
  SummaryList,
} from '@wts/ui/govuk-react-ui';
import { Accordion, AccordionSection } from '@wts/ui/shared-ui/server';
import {
  UkwmDraftSubmission,
  UkwmWasteTypeDetail,
} from '@wts/api/waste-tracking-gateway';
import { useState } from 'react';
import { ShowHide } from '@wts/ui/shared-ui';
import { FormatChemicalAndBiologicalComponents } from './FormatChemicalAndBiologicalComponents';
import { FormatHazCodes } from './FormatHazCodes';
import { FormatPopDetails } from './FormatPopDetails';
import { FormatPopConcentrate } from './FormatPopConcentrate';
import { slugify } from '../../utils';

interface SubmissionProps {
  data: UkwmDraftSubmission;
}

const wasteQuantitiesMap: { [key: string]: string } = {
  Tonne: 'tonnes',
  'Cubic Metre': 'm3',
  Kilogram: 'kg',
  Litre: 'lt',
};

export function Submission({ data }: SubmissionProps): JSX.Element {
  const [sections, setSections] = useState<{
    [key: string]: boolean;
  }>({
    aboutWaste: true,
    producerCollector: true,
    carrierDetails: true,
    receiverDetails: true,
  });
  function toggleSection(section: string) {
    setSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  }

  return (
    <>
      <Caption id={`reference-${data.transactionId}`}>
        Your reference: {data.transactionId}
      </Caption>
      <Heading>Waste movement record</Heading>
      <Accordion
        id="submissionAccordion"
        sections={sections}
        setSections={setSections}
      >
        <AccordionSection
          id="aboutWaste"
          title="About the waste"
          summary="You need to classify the waste before you start."
          sections={sections}
          toggle={toggleSection}
          status={data.wasteInformation.status}
        >
          {data.wasteInformation.status === 'Complete' &&
            data.wasteInformation.wasteTypes.map(
              (wasteType: UkwmWasteTypeDetail, index: number) => {
                return (
                  <SummaryCard
                    key={`ewc-card-${index}`}
                    title={`EWC ${wasteType.ewcCode}`}
                    id={`card-${slugify(wasteType.ewcCode)}`}
                  >
                    <SummaryList
                      hideBorders
                      items={[
                        {
                          key: 'Waste description',
                          value: wasteType.wasteDescription,
                        },
                        { key: 'Physical form', value: wasteType.physicalForm },
                      ]}
                    />
                    <SectionBreak size={'m'} />
                    <ShowHide id={`ewcCodeDetails${index + 1}`}>
                      <SummaryList
                        hideBorders
                        hideEmptyRows
                        items={[
                          {
                            key: 'Waste quantity',
                            value: (
                              <>
                                {wasteType.wasteQuantityType ===
                                  'EstimateData' && (
                                  <strong>
                                    Estimated
                                    <br />
                                  </strong>
                                )}
                                {wasteType.wasteQuantity}
                                {wasteQuantitiesMap[wasteType.quantityUnit]}
                              </>
                            ),
                          },
                          {
                            key: 'Chemical and biological components of waste',
                            value: (
                              <FormatChemicalAndBiologicalComponents
                                data={wasteType.chemicalAndBiologicalComponents}
                              />
                            ),
                          },
                          {
                            key: 'Hazardous properties',
                            value: wasteType.hasHazardousProperties
                              ? 'Yes'
                              : 'No',
                          },
                          {
                            key: 'Hazardous waste codes',
                            value:
                              wasteType.hazardousWasteCodes === undefined ? (
                                'Not provided'
                              ) : (
                                <FormatHazCodes
                                  data={wasteType.hazardousWasteCodes}
                                />
                              ),
                          },
                          {
                            key: 'Persistent organic pollutants (POPs)',
                            value: wasteType.containsPops ? 'Yes' : 'No',
                          },
                          {
                            key: 'Persistent organic pollutants (POPs) details',
                            value:
                              wasteType.hazardousWasteCodes === undefined ? (
                                'Not provided'
                              ) : (
                                <FormatPopDetails data={wasteType.pops} />
                              ),
                          },
                          {
                            key: 'Persistent organic pollutants (POPs) concentration value',
                            value:
                              wasteType.hazardousWasteCodes === undefined ? (
                                'Not provided'
                              ) : (
                                <FormatPopConcentrate data={wasteType.pops} />
                              ),
                          },
                        ]}
                      />
                    </ShowHide>
                  </SummaryCard>
                );
              },
            )}
          {data.wasteInformation.status === 'Complete' && (
            <SummaryList
              items={[
                {
                  key: 'Number and type of transportation containers',
                  value:
                    data.wasteInformation.wasteTransportation
                      .numberAndTypeOfContainers,
                },
                {
                  key: 'Special handling requirements details',
                  value: data.wasteInformation.wasteTransportation
                    .specialHandlingRequirements
                    ? data.wasteInformation.wasteTransportation
                        .specialHandlingRequirements
                    : 'Not provided',
                },
              ]}
              hideEmptyRows
            />
          )}
        </AccordionSection>

        <AccordionSection
          id="producerCollector"
          title="Producer and collection details"
          summary="The waste producer and collection of the waste details."
          sections={sections}
          toggle={toggleSection}
          status={data.producerAndCollection.status}
        >
          {data.producerAndCollection.status === 'Complete' && (
            <SummaryList
              items={[
                {
                  key: 'Producer organisation name',
                  value:
                    data.producerAndCollection.producer.contact
                      .organisationName,
                },
                {
                  key: 'Producer address',
                  value: (
                    <>
                      {data.producerAndCollection.producer.address.addressLine1}
                      <br />
                      {data.producerAndCollection.producer.address.townCity}
                      <br />
                      {data.producerAndCollection.producer.address.postcode}
                      <br />
                      {data.producerAndCollection.producer.address.country}
                    </>
                  ),
                },
                {
                  key: 'Producer contact name',
                  value: data.producerAndCollection.producer.contact.name,
                },
                {
                  key: 'Producer contact email address',
                  value: data.producerAndCollection.producer.contact.email,
                },
                {
                  key: 'Producer contact phone number',
                  value: data.producerAndCollection.producer.contact.phone,
                },
                {
                  key: 'Producer Standard Industrial Classification (SIC) code',
                  value: data.producerAndCollection.producer.sicCode,
                },
                {
                  key: 'Waste collection address',
                  value: (
                    <>
                      {
                        data.producerAndCollection.wasteCollection.address
                          .addressLine1
                      }
                      <br />
                      {
                        data.producerAndCollection.wasteCollection.address
                          .townCity
                      }
                      <br />
                      {
                        data.producerAndCollection.wasteCollection.address
                          .postcode
                      }
                      <br />
                      {
                        data.producerAndCollection.wasteCollection.address
                          .country
                      }
                    </>
                  ),
                },
                {
                  key: 'Local authority',
                  value:
                    data.producerAndCollection.wasteCollection.localAuthority,
                },
                {
                  key: 'Waste source',
                  value: data.producerAndCollection.wasteCollection.wasteSource,
                },
                {
                  key: 'Broker registration number',
                  value: data.producerAndCollection.wasteCollection
                    .brokerRegistrationNumber
                    ? data.producerAndCollection.wasteCollection
                        .brokerRegistrationNumber
                    : 'Not provided',
                },
              ]}
            />
          )}
        </AccordionSection>
        <AccordionSection
          id="carrierDetails"
          title="Carrier details"
          summary="The waste carrier and collection details of the waste"
          sections={sections}
          toggle={toggleSection}
          status={data.carrier.status}
        >
          {data.carrier.status === 'Complete' && (
            <SummaryList
              items={[
                {
                  key: 'Carrier organisation name',
                  value: data.carrier.value.contact.organisationName,
                },
                {
                  key: 'Carrier address',
                  value: (
                    <>
                      {data.carrier.value.address.addressLine1}
                      <br />
                      {data.carrier.value.address.addressLine2 && (
                        <>
                          {data.carrier.value.address.addressLine2}
                          <br />
                        </>
                      )}
                      {data.carrier.value.address.townCity}
                      <br />
                      {data.carrier.value.address.postcode}
                      <br />
                      {data.carrier.value.address.country}
                    </>
                  ),
                },
                {
                  key: 'Carrier contact name',
                  value: data.carrier.value.contact.name,
                },
                {
                  key: 'Carrier contact email address',
                  value: data.carrier.value.contact.email,
                },
                {
                  key: 'Carrier contact phone number',
                  value: data.carrier.value.contact.phone,
                },
              ]}
            />
          )}
        </AccordionSection>
        <AccordionSection
          id="receiverDetails"
          title="Receiver details"
          summary="The details of where the waste will be taken"
          sections={sections}
          toggle={toggleSection}
          status={data.receiver.status}
        >
          {data.receiver.status === 'Complete' && (
            <SummaryList
              items={[
                {
                  key: 'Receiver authorisation type',
                  value: data.receiver.value.authorizationType,
                },
                {
                  key: 'Receiver permit number or waste exemption number',
                  value: data.receiver.value.environmentalPermitNumber,
                },
                {
                  key: 'Receiver organisation name',
                  value: data.receiver.value.contact.organisationName,
                },
                {
                  key: 'Receiver address',
                  value: (
                    <>
                      {data.receiver.value.address.addressLine1}
                      <br />
                      {data.receiver.value.address.townCity}
                      <br />
                      {data.receiver.value.address.postcode}
                      <br />
                      {data.receiver.value.address.country}
                    </>
                  ),
                },
                {
                  key: 'Receiver postcode',
                  value: data.receiver.value.address.postcode,
                },
                {
                  key: 'Receiver contact name',
                  value: data.receiver.value.contact.name,
                },
                {
                  key: 'Receiver contact email address',
                  value: data.receiver.value.contact.email,
                },
                {
                  key: 'Receiver contact phone number',
                  value: data.receiver.value.contact.phone,
                },
              ]}
            />
          )}
        </AccordionSection>
      </Accordion>
      <ButtonGroup>
        <Button
          secondary={true}
          href={'../view?page=1'}
          id="return-view-all-link"
        >
          Return to view all records
        </Button>
      </ButtonGroup>
    </>
  );
}
