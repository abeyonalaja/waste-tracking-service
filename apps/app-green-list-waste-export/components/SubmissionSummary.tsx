import React, { useState } from 'react';
import type { DraftSubmission } from '@wts/api/waste-tracking-gateway';
import { Accordion } from './Accordion';
import { AccordionSection } from './AccordionSection';
import { AppLink } from './AppLink';
import * as GovUK from 'govuk-react';
import { BreakableString } from './BreakableString';
import { UnitDisplay } from './UnitDisplay';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { BORDER_COLOUR } from 'govuk-colours';
import styled from 'styled-components';
import formatEwcCode from '../utils/formatEwcCode';
import { EwcCodeType } from '../types/wts';
import { Tag } from 'govuk-react';
import useRefDataLookup from '../utils/useRefDataLookup';

interface Props {
  data: DraftSubmission;
  apiConfig: HeadersInit;
  showChangeLinks?: boolean;
  estimate?: boolean;
  isTemplate?: boolean;
  testId?: string;
  showEstimateLinks?: boolean;
  isMultiple?: boolean;
}

const DefinitionList = styled('dl')`
  margin: 0;
  font-size: 16px;
  line-height: 1.25;
  @media (min-width: 40.0625em) {
    font-size: 19px;
    line-height: 1.35;
    margin-bottom: 20px;
  }
`;

const Row = styled('div')`
  @media (min-width: 40.0625em) {
    display: flex;
    margin-bottom: 1px;
    flex-direction: row;
  }
`;

const Key = styled('dt')`
  margin: 0 0 5px;
  font-weight: 700;
  @media (min-width: 40.0625em) {
    padding-top: 10px;
    padding-bottom: 10px;
    padding-right: 20px;
    margin-bottom: 0;
    flex: 0 0 30%;
  }
`;

const Value = styled('dd')`
  margin: 0 0 15px;
  overflow-wrap: break-word;
  word-wrap: break-word;
  word-break: break-all;
  word-break: break-word;
  @media (min-width: 40.0625em) {
    padding-top: 10px;
    padding-right: 20px;
    padding-bottom: 10px;
    margin-bottom: 0;
    flex: 1 1 50%;
  }
`;

const Actions = styled('dd')`
  margin: 10px 0 15px;
  @media (min-width: 40.0625em) {
    padding-top: 10px;
    padding-bottom: 10px;
    text-align: right;
    margin: 0;
    flex: 0 0 20%;
  }
  a {
    margin-right: 10px;
    @media (min-width: 40.0625em) {
      margin: 0 0 0 15px;
    }
  }
`;

const SectionBreak = styled.span`
  background: ${BORDER_COLOUR};
  border: none;
  height: 1px;
  margin: 10px 0;
  display: block;
  width: 100%;
`;

const WasteCodeType = styled.div`
  font-weight: bold;
`;

const NotInTemplate = styled(Tag)`
  white-space: nowrap;
`;

const CodeDesc = styled.span``;

export const SubmissionSummary = ({
  data,
  showChangeLinks = true,
  estimate = false,
  isTemplate = false,
  apiConfig,
  testId,
  showEstimateLinks = true,
  isMultiple = false,
}: Props) => {
  const { t } = useTranslation();
  const getRefData = useRefDataLookup(apiConfig);
  const [expandedAll, setExpandedAll] = useState(!estimate || isMultiple);

  const handleAccordionShowAll = (expand) => {
    setExpandedAll(expand);
  };

  const quantityType = () => {
    if (
      data.wasteQuantity.status === 'Complete' &&
      data.wasteDescription.status === 'Complete'
    ) {
      if (data.wasteDescription.wasteCode.type !== 'NotApplicable') {
        if (data.wasteQuantity?.value.type === 'EstimateData') {
          return data.wasteQuantity.value.estimateData.quantityType;
        } else {
          if (data.wasteQuantity?.value.type === 'ActualData') {
            return data.wasteQuantity.value.actualData.quantityType;
          }
        }
      }
    }
  };

  return (
    <div data-testid={testId}>
      <Accordion
        showAll={true}
        expandedAll={expandedAll}
        onToggleShowAll={() => handleAccordionShowAll(!expandedAll)}
        id="check-answers-accordion"
      >
        <AccordionSection
          title={t('exportJourney.submitAnExport.yourRef')}
          expandedAll={expandedAll}
          id="check-answers-section-your-ref"
        >
          <DefinitionList>
            <Row>
              <Key>{t('exportJourney.checkAnswers.yourOwnReference')}</Key>
              <Value id="your-reference">
                {data.reference && <span>{data.reference}</span>}
                {!data.reference && (
                  <span id="your-reference-not-provided">
                    {t('exportJourney.checkAnswers.notProvided')}
                  </span>
                )}
              </Value>

              {showChangeLinks && (
                <Actions>
                  <AppLink
                    id="your-reference-change"
                    href={{
                      pathname: `/incomplete/reference`,
                      query: { id: data.id },
                    }}
                  >
                    {t('actions.change')}
                  </AppLink>
                </Actions>
              )}
            </Row>
          </DefinitionList>
        </AccordionSection>
        <AccordionSection
          title={'1. ' + t('exportJourney.submitAnExport.SectionOne.heading')}
          expandedAll={expandedAll}
          id="check-answers-section-about-waste"
          showTag={
            data.wasteQuantity.status === 'Complete' &&
            data.wasteQuantity.value.type === 'EstimateData' &&
            estimate
          }
        >
          {data.wasteDescription.status === 'Complete' && (
            <>
              <DefinitionList>
                <Row>
                  <Key id="waste-code-type-header">
                    {t('exportJourney.checkAnswers.wasteCode')}
                  </Key>
                  <Value>
                    {data.wasteDescription?.wasteCode.type ===
                      'NotApplicable' && <span>{t('notApplicable')}</span>}
                    {data.wasteDescription?.wasteCode.type !==
                      'NotApplicable' && (
                      <>
                        <WasteCodeType id="waste-code-type">
                          {data.wasteDescription?.wasteCode.type}
                        </WasteCodeType>
                        <strong>
                          {data.wasteDescription?.wasteCode.code}:{' '}
                        </strong>
                        <CodeDesc>
                          {getRefData(
                            'WasteCode',
                            data.wasteDescription?.wasteCode.code,
                            data.wasteDescription?.wasteCode.type,
                          )}
                        </CodeDesc>
                      </>
                    )}
                  </Value>

                  {showChangeLinks && (
                    <Actions>
                      <AppLink
                        id="waste-code-type-change"
                        href={{
                          pathname: `/incomplete/about/waste-code-warning`,
                          query: { id: data.id },
                        }}
                      >
                        {t('actions.change')}
                      </AppLink>
                    </Actions>
                  )}
                </Row>
              </DefinitionList>
              {/* EWC CODES */}
              <DefinitionList>
                <Row>
                  <Key id="ewc-codes-header">
                    {t('exportJourney.checkAnswers.ewcCodes')}
                  </Key>
                  <Value id="ewc-codes">
                    <GovUK.UnorderedList listStyleType="none">
                      {data.wasteDescription?.ewcCodes?.map(
                        (item: EwcCodeType, index) => (
                          <GovUK.ListItem key={index}>
                            <strong>{formatEwcCode(item.code)}: </strong>
                            <CodeDesc>{getRefData('EWC', item.code)}</CodeDesc>
                          </GovUK.ListItem>
                        ),
                      )}
                      {data.wasteDescription?.ewcCodes.length === 0 && (
                        <span id="ewc-not-provided">
                          {t('exportJourney.checkAnswers.notProvided')}
                        </span>
                      )}
                    </GovUK.UnorderedList>
                  </Value>
                  {showChangeLinks && (
                    <Actions>
                      <AppLink
                        id="ewc-codes-change"
                        href={{
                          pathname: `/incomplete/about/ewc-code`,
                          query: { id: data.id },
                        }}
                      >
                        {t('actions.change')}
                      </AppLink>
                    </Actions>
                  )}
                </Row>

                <Row>
                  <Key id="national-code-header">
                    {t('exportJourney.checkAnswers.nationalCode')}
                  </Key>
                  <Value id="national-code">
                    {data.wasteDescription?.nationalCode?.provided ===
                      'Yes' && (
                      <span>{data.wasteDescription?.nationalCode.value}</span>
                    )}
                    {data.wasteDescription?.nationalCode?.provided === 'No' && (
                      <span>{t('exportJourney.checkAnswers.notProvided')}</span>
                    )}
                    {data.wasteDescription?.nationalCode?.provided ===
                      undefined && (
                      <span>{t('exportJourney.checkAnswers.notProvided')}</span>
                    )}
                  </Value>
                  {showChangeLinks && (
                    <Actions>
                      <AppLink
                        id="national-code-change"
                        href={{
                          pathname: `/incomplete/about/national-code`,
                          query: { id: data.id },
                        }}
                      >
                        {t('actions.change')}
                      </AppLink>
                    </Actions>
                  )}
                </Row>

                <Row>
                  <Key id="waste-description-header">
                    {t('exportJourney.checkAnswers.wasteDescription')}
                  </Key>
                  <Value id="waste-description">
                    <BreakableString>
                      {data.wasteDescription?.description}
                    </BreakableString>
                  </Value>
                  {showChangeLinks && (
                    <Actions>
                      <AppLink
                        id="waste-destription-change"
                        href={{
                          pathname: `/incomplete/about/description`,
                          query: { id: data.id },
                        }}
                      >
                        {t('actions.change')}
                      </AppLink>
                    </Actions>
                  )}
                </Row>

                {data.wasteQuantity.status === 'Complete' && (
                  <>
                    <Row>
                      <Key id="waste-quanitity-header">
                        {t('exportJourney.checkAnswers.wasteQuantity')}
                      </Key>
                      {data.wasteQuantity.value && (
                        <Value id="waste-quanitity">
                          {data?.wasteQuantity.value.type ===
                            'EstimateData' && (
                            <b>
                              {t('exportJourney.checkAnswers.estimated')}
                              <br />
                            </b>
                          )}
                          {data.wasteQuantity.value.type !== 'NotApplicable' &&
                            data.wasteQuantity?.value.type ===
                              'EstimateData' && (
                              <span>
                                {data.wasteQuantity.value.estimateData.value}
                              </span>
                            )}
                          {data.wasteQuantity.value.type !== 'NotApplicable' &&
                            data.wasteQuantity?.value.type === 'ActualData' && (
                              <span>
                                {data.wasteQuantity.value.actualData.value}
                              </span>
                            )}

                          {data.wasteDescription.wasteCode.type !==
                          'NotApplicable' ? (
                            <UnitDisplay
                              quantityType={quantityType()}
                              type={data?.wasteDescription.wasteCode.type}
                            />
                          ) : (
                            <span> {t('weight.kg')}</span>
                          )}
                        </Value>
                      )}
                      {isTemplate && (
                        <Actions>
                          <NotInTemplate tint="GREY" id={`nit-quantity`}>
                            {t('templates.notInTemplate')}
                          </NotInTemplate>
                        </Actions>
                      )}
                      {showChangeLinks && (
                        <Actions>
                          <AppLink
                            id="waste-quanitity-change"
                            href={{
                              pathname: `/incomplete/about/quantity`,
                              query: { id: data.id },
                            }}
                          >
                            {t('actions.change')}
                          </AppLink>
                        </Actions>
                      )}
                      {!showChangeLinks &&
                        !isTemplate &&
                        showEstimateLinks &&
                        data?.wasteQuantity.value.type === 'EstimateData' && (
                          <Actions>
                            <AppLink
                              id="update-estimated-quantity"
                              href={{
                                pathname: `/estimated/update-quantity`,
                                query: { id: data.id },
                              }}
                            >
                              {t('actions.update')}
                            </AppLink>
                          </Actions>
                        )}
                    </Row>
                  </>
                )}
              </DefinitionList>
            </>
          )}
        </AccordionSection>
        <AccordionSection
          title={'2. ' + t('exportJourney.submitAnExport.SectionTwo.heading')}
          expandedAll={expandedAll}
          id="check-answers-section-export-import"
        >
          {data.exporterDetail.status === 'Complete' && (
            <>
              <GovUK.H3>
                {t('exportJourney.submitAnExport.SectionTwo.exporterDetails')}
              </GovUK.H3>
              <DefinitionList>
                <Row>
                  <Key id="exporter-address-header">{t('address')}</Key>
                  <Value id="exporter-address">
                    {data.exporterDetail?.exporterAddress.addressLine1}
                    <br />
                    {data.exporterDetail?.exporterAddress.addressLine2}
                    <br />
                    {data.exporterDetail?.exporterAddress.townCity}
                    <br />
                    {data.exporterDetail?.exporterAddress.postcode}
                  </Value>

                  {showChangeLinks && (
                    <Actions>
                      <AppLink
                        id="exporter-address-change"
                        href={{
                          pathname: `/incomplete/exporter-importer/exporter-details-manual`,
                          query: { id: data.id },
                        }}
                      >
                        {t('actions.change')}
                      </AppLink>
                    </Actions>
                  )}
                </Row>

                <Row>
                  <Key id="exporter-country-header">{t('address.country')}</Key>
                  <Value id="exporter-country">
                    {data.exporterDetail?.exporterAddress.country}
                    <br />
                  </Value>
                </Row>
                <SectionBreak />
                <Row>
                  <Key id="exporter-organisation-name-header">
                    {t('contact.orgName')}
                  </Key>
                  <Value id="exporter-organisation-name">
                    {
                      data.exporterDetail?.exporterContactDetails
                        .organisationName
                    }
                  </Value>
                  {showChangeLinks && (
                    <Actions>
                      <AppLink
                        id="exporter-organisation-name-change"
                        href={{
                          pathname: `/incomplete/exporter-importer/exporter-details`,
                          query: { id: data.id },
                        }}
                      >
                        {t('actions.change')}
                      </AppLink>
                    </Actions>
                  )}
                </Row>

                {/*  Full name */}

                <Row>
                  <Key id="exporter-full-name-header">
                    {t('contact.fullName')}
                  </Key>
                  <Value id="exporter-full-name">
                    {data.exporterDetail?.exporterContactDetails.fullName}
                  </Value>
                </Row>
                {/*  Email address */}

                <Row>
                  <Key id="exporter-email-header">
                    {t('contact.emailAddress')}
                  </Key>
                  <Value id="exporter-email">
                    <BreakableString>
                      {data.exporterDetail?.exporterContactDetails.emailAddress}
                    </BreakableString>
                  </Value>
                </Row>

                <Row>
                  <Key id="exporter-phone-header">
                    {t('contact.phoneNumber')}
                  </Key>
                  <Value id="exporter-phone">
                    {data.exporterDetail?.exporterContactDetails.phoneNumber}
                  </Value>
                </Row>

                <Row>
                  <Key id="exporter-fax-header">{t('contact.faxNumber')}</Key>
                  <Value id="exporter-fax">
                    {data.exporterDetail?.exporterContactDetails.faxNumber && (
                      <span>
                        {data.exporterDetail?.exporterContactDetails.faxNumber}
                      </span>
                    )}
                    {!data.exporterDetail?.exporterContactDetails.faxNumber && (
                      <span>{t('exportJourney.checkAnswers.notProvided')}</span>
                    )}
                  </Value>
                </Row>
                <SectionBreak />
              </DefinitionList>
            </>
          )}

          {data.importerDetail.status === 'Complete' && (
            <>
              {/* IMPORTER */}
              <GovUK.H3>
                {t('exportJourney.submitAnExport.SectionTwo.importerDetails')}
              </GovUK.H3>
              <DefinitionList>
                <Row>
                  <Key id="importer-organisation-name-header">
                    {t('contact.orgName')}
                  </Key>
                  <Value id="importer-organisation-name">
                    {
                      data.importerDetail?.importerAddressDetails
                        .organisationName
                    }
                  </Value>
                  {showChangeLinks && (
                    <Actions>
                      <AppLink
                        id="importer-details-change"
                        href={{
                          pathname: `/incomplete/exporter-importer/importer-details`,
                          query: { id: data.id },
                        }}
                      >
                        {t('actions.change')}
                      </AppLink>
                    </Actions>
                  )}
                </Row>
                <Row>
                  <Key id="importer-address-header">{t('address')}</Key>
                  <Value id="importer-address">
                    {data.importerDetail?.importerAddressDetails.address}
                  </Value>
                </Row>
                {/* COUNTRY */}
                <Row>
                  <Key id="importer-country-header">{t('address.country')}</Key>
                  <Value id="importer-country">
                    {data.importerDetail?.importerAddressDetails.country}
                    <br />
                  </Value>
                </Row>
                <SectionBreak />
                {/*  Full name */}
                <Row>
                  <Key id="importer-full-name-header">
                    {t('contact.fullName')}
                  </Key>
                  <Value id="importer-full-name">
                    {data.importerDetail?.importerContactDetails.fullName}
                  </Value>
                  {showChangeLinks && (
                    <Actions>
                      <AppLink
                        id="importer-contact-details-change"
                        href={{
                          pathname: `/incomplete/exporter-importer/importer-contact-details`,
                          query: { id: data.id },
                        }}
                      >
                        {t('actions.change')}
                      </AppLink>
                    </Actions>
                  )}
                </Row>
                {/*  Email address */}
                <Row>
                  <Key id="importer-email-header">
                    {t('contact.emailAddress')}
                  </Key>
                  <Value id="importer-email">
                    {data.importerDetail?.importerContactDetails.emailAddress}
                  </Value>
                </Row>
                <Row>
                  <Key id="importer-phone-header">
                    {t('contact.phoneNumber')}
                  </Key>
                  <Value id="importer-phone">
                    {data.importerDetail?.importerContactDetails.phoneNumber}
                  </Value>
                </Row>
                <Row>
                  <Key id="importer-fax-header">{t('contact.faxNumber')}</Key>
                  <Value id="importer-fax">
                    {data.importerDetail?.importerContactDetails.faxNumber && (
                      <span>
                        {data.importerDetail?.importerContactDetails.faxNumber}
                      </span>
                    )}
                    {!data.importerDetail?.importerContactDetails.faxNumber && (
                      <span id="importer-fax-not-provided">
                        {t('exportJourney.checkAnswers.notProvided')}
                      </span>
                    )}
                  </Value>
                </Row>{' '}
              </DefinitionList>
            </>
          )}
        </AccordionSection>
        <AccordionSection
          title={'3. ' + t('exportJourney.submitAnExport.SectionThree.heading')}
          expandedAll={expandedAll}
          id="check-answers-section-journey"
          showTag={
            data.collectionDate.status === 'Complete' &&
            data.collectionDate.value.type === 'EstimateDate' &&
            estimate
          }
        >
          {data.collectionDate.status === 'Complete' && (
            <>
              <DefinitionList>
                <Row>
                  <Key id="collection-date-header">
                    {t(
                      'exportJourney.submitAnExport.SectionThree.collectionDate',
                    )}
                  </Key>

                  {data.collectionDate.value.type === 'EstimateDate' && (
                    <Value id="collection-date">
                      <div>
                        <b>{t('exportJourney.checkAnswers.estimated')}</b>
                        <br />
                      </div>

                      {format(
                        new Date(
                          Number(data.collectionDate.value.estimateDate.year),
                          Number(data.collectionDate.value.estimateDate.month) -
                            1,
                          Number(data.collectionDate.value.estimateDate.day),
                        ),
                        'd MMMM y',
                      )}
                    </Value>
                  )}

                  {data.collectionDate.value.type === 'ActualDate' && (
                    <Value id="collection-date">
                      {format(
                        new Date(
                          Number(data.collectionDate.value.actualDate.year),
                          Number(data.collectionDate.value.actualDate.month) -
                            1,
                          Number(data.collectionDate.value.actualDate.day),
                        ),
                        'd MMMM y',
                      )}
                    </Value>
                  )}

                  {showChangeLinks && (
                    <Actions>
                      <AppLink
                        id="collection-date-change"
                        href={{
                          pathname: `/incomplete/journey/collection-date`,
                          query: { id: data.id },
                        }}
                      >
                        {t('actions.change')}
                      </AppLink>
                    </Actions>
                  )}

                  {!showChangeLinks &&
                    !isTemplate &&
                    showEstimateLinks &&
                    data.collectionDate.value.type === 'EstimateDate' && (
                      <Actions>
                        <AppLink
                          id="collection-date-update"
                          href={{
                            pathname: `/estimated/update-collection-date`,
                            query: { id: data.id },
                          }}
                        >
                          {t('actions.update')}
                        </AppLink>
                      </Actions>
                    )}

                  {isTemplate && (
                    <Actions>
                      <NotInTemplate tint="GREY" id="nit-collection-date">
                        {t('templates.notInTemplate')}
                      </NotInTemplate>
                    </Actions>
                  )}
                </Row>
                <SectionBreak />
              </DefinitionList>
            </>
          )}
          {data.carriers.status === 'Complete' && (
            <>
              {data.carriers.values?.map((item, index) => (
                <div id={'carrier-' + index} key={index}>
                  <GovUK.H3>
                    {t('exportJourney.wasteCarrier.carriersPage.cardTitle', {
                      n: t(`numberAdjective.${index + 1}`),
                    })}
                  </GovUK.H3>
                  <DefinitionList>
                    <Row>
                      <Key id={'carrier-organisation-name-header' + index}>
                        {t('exportJourney.checkAnswers.organasiationName')}
                      </Key>
                      <Value id={'carrier-organisation-name' + index}>
                        {item.addressDetails?.organisationName}
                      </Value>
                      {showChangeLinks && (
                        <Actions>
                          <AppLink
                            id={'carrier-change' + index}
                            href={{
                              pathname: `/incomplete/journey/waste-carriers`,
                              query: { id: data.id, carrierId: item.id },
                            }}
                          >
                            {t('actions.change')}
                          </AppLink>
                        </Actions>
                      )}
                    </Row>
                    <Row>
                      <Key id={'carrier-address-header' + index}>
                        {t('address')}
                      </Key>
                      <Value id={'carrier-address' + index}>
                        {item.addressDetails?.address}
                      </Value>
                    </Row>
                    <Row>
                      <Key id={'carrier-country-header' + index}>
                        {t('address.country')}
                      </Key>
                      <Value id={'carrier-country' + index}>
                        {item.addressDetails?.country}
                      </Value>
                    </Row>
                    <SectionBreak />
                    <Row>
                      <Key id={'carrier-full-name-header' + index}>
                        {t('contact.person')}
                      </Key>
                      <Value id={'carrier-full-name' + index}>
                        {item.contactDetails?.fullName}
                      </Value>
                      {showChangeLinks && (
                        <Actions>
                          <AppLink
                            id={'carrier-contact-details-change' + index}
                            href={{
                              pathname: `/incomplete/journey/waste-carriers`,
                              query: {
                                id: data.id,
                                carrierId: item.id,
                                page: 'CONTACT_DETAILS',
                              },
                            }}
                          >
                            {t('actions.change')}
                          </AppLink>
                        </Actions>
                      )}
                    </Row>

                    <Row>
                      <Key id={'carrier-email-header' + index}>
                        {t('contact.emailAddress')}
                      </Key>
                      <Value id={'carrier-email' + index}>
                        {item.contactDetails?.emailAddress}
                      </Value>
                    </Row>
                    <Row>
                      <Key id={'carrier-phone-header' + index}>
                        {t('contact.phoneNumber')}
                      </Key>
                      <Value id={'carrier-phone' + index}>
                        {item.contactDetails?.phoneNumber}
                      </Value>
                    </Row>

                    <Row>
                      <Key id={'carrier-fax-header' + index}>
                        {t('contact.faxNumber')}
                      </Key>
                      <Value id={'carrier-fax' + index}>
                        {item.contactDetails?.faxNumber && (
                          <span>{item.contactDetails?.faxNumber}</span>
                        )}
                        {!item.contactDetails?.faxNumber && (
                          <span>
                            {t('exportJourney.checkAnswers.notProvided')}
                          </span>
                        )}
                      </Value>
                    </Row>
                    {item.transportDetails?.type && (
                      <>
                        <Row>
                          <Key id={'carrier-type-header' + index}>
                            {t('exportJourney.checkAnswers.transportOfWaste')}
                          </Key>
                          <Value id={'carrier-type' + index}>
                            {t(
                              `exportJourney.wasteCarrierTransport.${item.transportDetails?.type}`,
                            )}
                          </Value>
                          {showChangeLinks && (
                            <Actions>
                              <AppLink
                                id={'carrier-type-change' + index}
                                href={{
                                  pathname: `/incomplete/journey/waste-carriers`,
                                  query: {
                                    id: data.id,
                                    carrierId: item.id,
                                    page: 'TRANSPORT_CHOICE',
                                  },
                                }}
                              >
                                {t('actions.change')}
                              </AppLink>
                            </Actions>
                          )}
                          {isTemplate && (
                            <Actions>
                              <NotInTemplate
                                tint="GREY"
                                id={`nit-transport-means-${index}`}
                              >
                                {t('templates.notInTemplate')}
                              </NotInTemplate>
                            </Actions>
                          )}
                        </Row>
                        <Row>
                          <Key id={'carrier-type-details-header' + index}>
                            {t('exportJourney.checkAnswers.transportDetails')}
                          </Key>
                          <Value id={'carrier-type-details' + index}>
                            {item.transportDetails?.description === undefined ||
                            item.transportDetails?.description === ''
                              ? t('exportJourney.checkAnswers.notProvided')
                              : item.transportDetails?.description}
                          </Value>
                          {isTemplate && (
                            <Actions>
                              <NotInTemplate
                                tint="GREY"
                                id={`nit-transport-details-${index}`}
                              >
                                {t('templates.notInTemplate')}
                              </NotInTemplate>
                            </Actions>
                          )}
                          {showChangeLinks && (
                            <Actions>
                              <AppLink
                                id={'carrier-type-details-change' + index}
                                href={{
                                  pathname: `/incomplete/journey/waste-carriers`,
                                  query: {
                                    id: data.id,
                                    carrierId: item.id,
                                    page: 'TRANSPORT_DETAILS',
                                  },
                                }}
                              >
                                {t('actions.change')}
                              </AppLink>
                            </Actions>
                          )}
                        </Row>
                      </>
                    )}
                  </DefinitionList>
                </div>
              ))}
            </>
          )}
          {data.collectionDetail.status === 'Complete' && (
            <>
              <GovUK.H3>
                {t('exportJourney.wasteCollectionDetails.caption')}
              </GovUK.H3>
              <DefinitionList>
                <Row>
                  <Key id="waste-collection-address-header">{t('address')}</Key>
                  <Value id="waste-collection-address">
                    {data.collectionDetail?.address.addressLine1}
                    <br />
                    {data.collectionDetail?.address.addressLine2}
                    <br />
                    {data.collectionDetail?.address.townCity}
                    <br />
                    {data.collectionDetail?.address.postcode}
                    <br />
                  </Value>

                  {showChangeLinks && (
                    <Actions>
                      <AppLink
                        id="waste-collection-address-change"
                        href={{
                          pathname: `/incomplete/journey/collection-details`,
                          query: { id: data.id, page: 'MANUAL_ADDRESS' },
                        }}
                      >
                        {t('actions.change')}
                      </AppLink>
                    </Actions>
                  )}
                </Row>

                <Row>
                  <Key id="waste-collection-country-header">
                    {t('address.country')}
                  </Key>
                  <Value id="waste-collection-country">
                    {data.collectionDetail?.address.country}
                    <br />
                  </Value>
                </Row>
                <SectionBreak />
                <Row>
                  <Key id="waste-collection-full-name-header">
                    {t('exportJourney.checkAnswers.organasiationName')}
                  </Key>
                  <Value id="waste-collection-full-name">
                    {data.collectionDetail?.contactDetails.organisationName}
                  </Value>
                  {showChangeLinks && (
                    <Actions>
                      <AppLink
                        id="waste-collection-full-name-change"
                        href={{
                          pathname: `/incomplete/journey/collection-details`,
                          query: { id: data.id },
                        }}
                      >
                        {t('actions.change')}
                      </AppLink>
                    </Actions>
                  )}
                </Row>

                <Row>
                  <Key id="waste-collection-contact-person-header">
                    {t('contact.person')}
                  </Key>
                  <Value id="waste-collection-contact-person">
                    {data.collectionDetail?.contactDetails.fullName}
                  </Value>
                </Row>
                {/*  Email address */}

                <Row>
                  <Key id="waste-collection-email-header">
                    {t('contact.emailAddress')}
                  </Key>
                  <Value id="waste-collection-email">
                    {data.collectionDetail?.contactDetails.emailAddress}
                  </Value>
                </Row>

                <Row>
                  <Key id="waste-collection-phone-header">
                    {t('contact.phoneNumber')}
                  </Key>
                  <Value id="waste-collection-phone">
                    {data.collectionDetail?.contactDetails.phoneNumber}
                  </Value>
                </Row>

                <Row>
                  <Key id="waste-collection-fax-header">
                    {t('contact.faxNumber')}
                  </Key>
                  <Value id="waste-collection-fax">
                    {data.collectionDetail?.contactDetails.faxNumber ===
                    undefined
                      ? t('exportJourney.checkAnswers.notProvided')
                      : data.collectionDetail?.contactDetails.faxNumber}
                  </Value>
                </Row>
                <SectionBreak />
              </DefinitionList>
            </>
          )}
          {data.ukExitLocation.status === 'Complete' && (
            <>
              <GovUK.H3>{t('exportJourney.pointOfExit.caption')}</GovUK.H3>
              <DefinitionList>
                <Row>
                  <Key id="exit-location-header">{t('location')}</Key>
                  <Value id="exit-location">
                    {data.ukExitLocation?.exitLocation.provided === 'Yes' && (
                      <span>{data.ukExitLocation?.exitLocation.value}</span>
                    )}
                    {data.ukExitLocation?.exitLocation.provided === 'No' && (
                      <span id="exit-location-not-provided">
                        {t('exportJourney.checkAnswers.notProvided')}
                      </span>
                    )}

                    <br />
                  </Value>

                  {showChangeLinks && (
                    <Actions>
                      <AppLink
                        id="exit-location-change"
                        href={{
                          pathname: `/incomplete/journey/exit-location`,
                          query: { id: data.id },
                        }}
                      >
                        {t('actions.change')}
                      </AppLink>
                    </Actions>
                  )}
                </Row>
                <SectionBreak />
              </DefinitionList>
            </>
          )}

          {data.transitCountries.status === 'Complete' && (
            <>
              <GovUK.H3>
                {t('exportJourney.wasteTransitCountries.caption')}
              </GovUK.H3>
              <DefinitionList>
                <Row>
                  <Key id="transit-countries-header">
                    {t('exportJourney.wasteTransitCountries.listTitle')}
                  </Key>
                  <Value id="transit-countries">
                    {data.transitCountries.values.length > 0 && (
                      <GovUK.OrderedList mb={0}>
                        {data.transitCountries.values?.map((item, index) => (
                          <GovUK.ListItem key={index}>{item}</GovUK.ListItem>
                        ))}
                      </GovUK.OrderedList>
                    )}

                    {data.transitCountries.values.length === 0 && (
                      <span id="transit-countries-not-provided">
                        {t('exportJourney.checkAnswers.notProvided')}
                      </span>
                    )}
                  </Value>

                  {showChangeLinks && (
                    <Actions>
                      <AppLink
                        id="transit-countries-change"
                        href={{
                          pathname: `/incomplete/journey/transit-countries`,
                          query: { id: data.id },
                        }}
                      >
                        {t('actions.change')}
                      </AppLink>
                    </Actions>
                  )}
                </Row>
              </DefinitionList>
            </>
          )}
        </AccordionSection>
        <AccordionSection
          title={'4. ' + t('exportJourney.submitAnExport.SectionFour.heading')}
          expandedAll={expandedAll}
          id="check-answers-section-treatment"
        >
          {data.recoveryFacilityDetail.status === 'Complete' && (
            <>
              {data.recoveryFacilityDetail.values
                .filter(
                  (site) => site.recoveryFacilityType?.type === 'Laboratory',
                )
                .map((filteredSite, index) => (
                  <SiteDetails
                    site={filteredSite}
                    index={index}
                    id={data.id}
                    key={`lab${index}`}
                    showChangeLinks={showChangeLinks}
                    apiConfig={apiConfig}
                  />
                ))}

              {data.recoveryFacilityDetail.values
                .filter(
                  (site) => site.recoveryFacilityType?.type === 'InterimSite',
                )
                .map((filteredSite, index) => (
                  <>
                    <SiteDetails
                      site={filteredSite}
                      index={index}
                      id={data.id}
                      key={`interimSite${index}`}
                      showChangeLinks={showChangeLinks}
                      apiConfig={apiConfig}
                    />
                  </>
                ))}

              {data.recoveryFacilityDetail.values
                .filter(
                  (site) =>
                    site.recoveryFacilityType?.type === 'RecoveryFacility',
                )
                .map((filteredSite, index) => (
                  <SiteDetails
                    site={filteredSite}
                    index={index}
                    id={data.id}
                    key={`recFac${index}`}
                    multiple={
                      data.recoveryFacilityDetail.status === 'Complete' &&
                      data.recoveryFacilityDetail.values.filter(
                        (site) =>
                          site.recoveryFacilityType?.type ===
                          'RecoveryFacility',
                      ).length > 1
                    }
                    showChangeLinks={showChangeLinks}
                    apiConfig={apiConfig}
                  />
                ))}
            </>
          )}
        </AccordionSection>
      </Accordion>
    </div>
  );
};

const SiteDetails = ({
  site,
  index,
  id,
  multiple = false,
  showChangeLinks,
  apiConfig,
}) => {
  const { t } = useTranslation();
  const getRefData = useRefDataLookup(apiConfig);
  const type = site.recoveryFacilityType.type;
  let titleKey, nameKey, codeKey, url, code;

  switch (type) {
    case 'Laboratory':
      titleKey = 'exportJourney.checkAnswers.titleLaboratory';
      nameKey = 'exportJourney.laboratorySite.name';
      url = '/laboratory';
      codeKey = 'exportJourney.checkAnswers.codeLaboratory';
      code = site.recoveryFacilityType.disposalCode;
      break;
    case 'InterimSite':
      titleKey = 'exportJourney.checkAnswers.titleInterimSite';
      nameKey = 'exportJourney.interimSite.name';
      url = '/interim-site-details';
      codeKey = 'exportJourney.recoveryFacilities.recoveryCode';
      code = site.recoveryFacilityType.recoveryCode;
      break;
    case 'RecoveryFacility':
      titleKey = !multiple
        ? 'exportJourney.checkAnswers.titleRecoveryFacility'
        : t('exportJourney.recoveryFacilities.multipleCardTitle', {
            n: t(`numberAdjective.${index + 1}`),
          });
      nameKey = 'exportJourney.recoveryFacilities.name';
      url = '/recovery-facility-details';
      codeKey = 'exportJourney.recoveryFacilities.recoveryCode';
      code = site.recoveryFacilityType.recoveryCode;
      break;
  }

  return (
    <div id={`${type.toLowerCase()}-${index}`}>
      <GovUK.H3>{t(titleKey)}</GovUK.H3>
      <DefinitionList>
        <Row>
          <Key id={`${type.toLowerCase()}-org-name-title-${index}`}>
            {t(nameKey)}
          </Key>
          <Value id={`${type.toLowerCase()}-org-name-${index}`}>
            {site.addressDetails.name}
          </Value>
          {showChangeLinks && (
            <Actions>
              <AppLink
                href={{
                  pathname: `/incomplete/treatment${url}`,
                  query: { id, site: site.id, page: 'ADDRESS_DETAILS' },
                }}
                id={`${type.toLowerCase()}-change-address-${index}`}
              >
                {t('actions.change')}
              </AppLink>
            </Actions>
          )}
        </Row>

        <Row>
          <Key id={`${type.toLowerCase()}-address-title-${index}`}>
            {t('address')}
          </Key>
          <Value id={`${type.toLowerCase()}-address-${index}`}>
            {site.addressDetails.address}
          </Value>
        </Row>

        <Row>
          <Key id={`${type.toLowerCase()}-country-title-${index}`}>
            {t('address.country')}
          </Key>
          <Value id={`${type.toLowerCase()}-country-${index}`}>
            {site.addressDetails.country}
          </Value>
        </Row>
        <SectionBreak />
        <Row>
          <Key id={`${type.toLowerCase()}-contact-person-title-${index}`}>
            {t('contact.person')}
          </Key>
          <Value id={`${type.toLowerCase()}-contact-person-${index}`}>
            {site.contactDetails.fullName}
          </Value>
          {showChangeLinks && (
            <Actions>
              <AppLink
                href={{
                  pathname: `/incomplete/treatment${url}`,
                  query: { id, site: site.id, page: 'CONTACT_DETAILS' },
                }}
                id={`${type.toLowerCase()}-change-contact-${index}`}
              >
                {t('actions.change')}
              </AppLink>
            </Actions>
          )}
        </Row>

        <Row>
          <Key id={`${type.toLowerCase()}-email-title-${index}`}>
            {t('contact.emailAddress')}
          </Key>
          <Value id={`${type.toLowerCase()}-email-${index}`}>
            {site.contactDetails.emailAddress}
          </Value>
        </Row>

        <Row>
          <Key id={`${type.toLowerCase()}-phone-title-${index}`}>
            {t('contact.phoneNumber')}
          </Key>
          <Value id={`${type.toLowerCase()}-phone-${index}`}>
            {site.contactDetails.phoneNumber}
          </Value>
        </Row>

        <Row>
          <Key id={`${type.toLowerCase()}-fax-title-${index}`}>
            {t('contact.faxNumber')}
          </Key>
          <Value id={`${type.toLowerCase()}-fax-${index}`}>
            {site.contactDetails.faxNumber === undefined ||
            site.contactDetails.faxNumber.length === 0
              ? t('exportJourney.checkAnswers.notProvided')
              : site.contactDetails.faxNumber}
          </Value>
        </Row>
        <SectionBreak />
        <Row>
          <Key id={`${type.toLowerCase()}-code-title-${index}`}>
            {t(codeKey)}
          </Key>
          <Value id={`${type.toLowerCase()}-code-${index}`}>
            <strong>{code}: </strong>
            <CodeDesc>{getRefData(type, code)}</CodeDesc>
          </Value>
          {showChangeLinks && (
            <Actions>
              <AppLink
                href={{
                  pathname: `/incomplete/treatment${url}`,
                  query: { id, site: site.id, page: 'RECOVERY_CODE' },
                }}
                id={`${type.toLowerCase()}-change-code-${index}`}
              >
                {t('actions.change')}
              </AppLink>
            </Actions>
          )}
        </Row>
      </DefinitionList>
      {multiple && index === 0 && <SectionBreak />}
    </div>
  );
};
