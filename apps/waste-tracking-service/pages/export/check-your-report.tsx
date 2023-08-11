import React, {
  useEffect,
  useState,
  useReducer,
  useCallback,
  FormEvent,
} from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import * as GovUK from 'govuk-react';
import '../../i18n/config';
import { useTranslation } from 'react-i18next';
import boldUpToFirstColon from '../../utils/boldUpToFirstColon';
import {
  Accordion,
  AccordionSection,
  AppLink,
  CompleteFooter,
  CompleteHeader,
  BreadcrumbWrap,
  ButtonGroup,
  Paragraph,
  SubmissionNotFound,
  SaveReturnButton,
  Loading,
  UnitDisplay,
  WasteCarrierHeading,
  BreakableString,
} from '../../components';
import styled from 'styled-components';
import { BORDER_COLOUR } from 'govuk-colours';
import { Submission } from '@wts/api/waste-tracking-gateway';
import { format } from 'date-fns';

type State = {
  data: Submission;
  isLoading: boolean;
  isError: boolean;
};

type Action = {
  type: 'DATA_FETCH_INIT' | 'DATA_FETCH_SUCCESS' | 'DATA_FETCH_FAILURE';
  payload?: Submission;
};

const initialWasteDescState: State = {
  data: null,
  isLoading: true,
  isError: false,
};

const checkYourReportReducer = (state: State, action: Action) => {
  switch (action.type) {
    case 'DATA_FETCH_INIT':
      return {
        ...state,
        isLoading: true,
        isError: false,
      };
    case 'DATA_FETCH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload,
      };
    case 'DATA_FETCH_FAILURE':
      return {
        ...state,
        isLoading: false,
        isError: true,
      };
    default:
      throw new Error();
  }
};

const DefinitionList = styled('dl')`
  margin: 0;
  font-size: 16px;
  line-height: 1.25;
  @media (min-width: 40.0625em) {
    display: table;
    width: 100%;
    table-layout: fixed;
    border-collapse: collapse;
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
  padding-bottom: 1em;
  font-weight: bold;
`;

const CheckYourReport = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [checkYourReportPage, dispatchCheckYourReportPage] = useReducer(
    checkYourReportReducer,
    initialWasteDescState
  );
  const [id, setId] = useState(null);
  const [expandedAll, setExpandedAll] = useState(true);

  const [sectionStatus, setSectionStatus] = useState<number>(0);

  useEffect(() => {
    if (router.isReady) {
      setId(router.query.id);
    }
  }, [router.isReady, router.query.id]);

  useEffect(() => {
    dispatchCheckYourReportPage({ type: 'DATA_FETCH_INIT' });
    if (id !== null) {
      fetch(`${process.env.NX_API_GATEWAY_URL}/submissions/${id}`)
        .then((response) => {
          if (response.ok) return response.json();
          else {
            dispatchCheckYourReportPage({ type: 'DATA_FETCH_FAILURE' });
          }
        })
        .then((data) => {
          if (data !== undefined) {
            dispatchCheckYourReportPage({
              type: 'DATA_FETCH_SUCCESS',
              payload: data,
            });
          }
        });
    }
  }, [router.isReady, id]);

  useEffect(() => {
    if (checkYourReportPage.data !== null) {
      const sectionOneStatus = isSectionComplete([
        'wasteDescription',
        'wasteQuantity',
      ]);
      const sectionTwoStatus = isSectionComplete([
        'exporterDetail',
        'importerDetail',
      ]);
      const sectionThreeStatus = isSectionComplete([
        'collectionDate',
        'carriers',
        'collectionDetail',
        'ukExitLocation',
        'transitCountries',
      ]);
      const sectionFourStatus = isSectionComplete(['recoveryFacilityDetail']);
      const sectionFiveStatus = isSectionComplete([
        'submissionConfirmation',
        'submissionDeclaration',
      ]);
      const statusCount = [
        sectionOneStatus,
        sectionTwoStatus,
        sectionThreeStatus,
        sectionFourStatus,
        sectionFiveStatus,
      ].filter(Boolean).length;
      setSectionStatus(statusCount);

      if (statusCount != 4) {
        router.push('/submit-an-export-tasklist?id=' + id);
      }
    }
  }, [checkYourReportPage.data, id, router]);

  const isSectionComplete = (sections) => {
    const completedSections = sections.filter((section) => {
      return checkYourReportPage.data[section].status === 'Complete';
    });
    return sections.length === completedSections.length;
  };
  const handleSubmit = useCallback(
    (e: FormEvent, returnToDraft = false) => {
      fetch(
        `${process.env.NX_API_GATEWAY_URL}/submissions/${id}/submission-confirmation`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            status: 'Complete',
            confirmation: true,
          }),
        }
      )
        .then((response) => {
          if (response.ok) return response.json();
        })
        .then((data) => {
          if (data !== undefined) {
            const path = returnToDraft
              ? `${process.env.NX_EXPORT_URL}/submit-an-export-tasklist`
              : `${process.env.NX_EXPORT_URL}/sign-declaration`;
            router.push({
              pathname: path,
              query: { id },
            });
          }
        });

      e.preventDefault();
    },
    [id, router, checkYourReportPage]
  );

  const BreadCrumbs = () => {
    return (
      <BreadcrumbWrap>
        <GovUK.BackLink
          href="#"
          onClick={() => {
            history.back();
          }}
        >
          Back
        </GovUK.BackLink>
      </BreadcrumbWrap>
    );
  };

  const handleAccordionShowAll = (expand) => {
    setExpandedAll(expand);
  };

  const quantityType = () => {
    if (
      checkYourReportPage?.data.wasteQuantity.status === 'Complete' &&
      checkYourReportPage?.data.wasteDescription.status === 'Complete'
    ) {
      if (
        checkYourReportPage.data.wasteDescription.wasteCode.type !==
        'NotApplicable'
      ) {
        if (
          checkYourReportPage.data.wasteQuantity?.value.type === 'EstimateData'
        ) {
          return checkYourReportPage.data.wasteQuantity.value.estimateData
            .quantityType;
        } else {
          if (
            checkYourReportPage.data.wasteQuantity?.value.type === 'ActualData'
          ) {
            return checkYourReportPage.data.wasteQuantity.value.actualData
              .quantityType;
          }
        }
      }
    }
  };

  return (
    <>
      <Head>
        <title>{t('exportJourney.checkAnswers.pageTitle')}</title>
      </Head>

      <GovUK.Page
        id="content"
        header={<CompleteHeader />}
        footer={<CompleteFooter />}
        beforeChildren={<BreadCrumbs />}
      >
        {checkYourReportPage.isError && !checkYourReportPage.isLoading && (
          <SubmissionNotFound />
        )}
        {checkYourReportPage.isLoading && <Loading />}
        {!checkYourReportPage.isError && !checkYourReportPage.isLoading && (
          <>
            <GovUK.GridRow>
              <GovUK.GridCol setWidth="two-thirds">
                <GovUK.Caption id="my-reference">
                  {t('exportJourney.checkAnswers.caption')}
                </GovUK.Caption>
                <GovUK.Heading size="LARGE" id="template-heading">
                  {t('exportJourney.checkAnswers.heading')}
                </GovUK.Heading>
                <Paragraph>
                  {t('exportJourney.checkAnswers.paragraph')}
                </Paragraph>
                {((checkYourReportPage.data?.wasteQuantity.status ===
                  'Complete' &&
                  checkYourReportPage.data?.wasteQuantity?.value.type ===
                    'EstimateData') ||
                  (checkYourReportPage.data?.collectionDate.status ===
                    'Complete' &&
                    checkYourReportPage.data?.collectionDate?.value.type ===
                      'EstimateDate')) && (
                  <div id="estimate-date-warning-text">
                    <GovUK.WarningText>
                      {t('exportJourney.checkAnswers.warning')}
                    </GovUK.WarningText>
                  </div>
                )}

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
                        <Key>
                          {t('exportJourney.checkAnswers.yourOwnReference')}
                        </Key>
                        <Value id="your-reference">
                          {checkYourReportPage.data?.reference && (
                            <span>{checkYourReportPage.data?.reference}</span>
                          )}
                          {!checkYourReportPage.data?.reference && (
                            <span id="your-reference-not-provided">
                              {t('exportJourney.checkAnswers.notProvided')}
                            </span>
                          )}
                        </Value>

                        <Actions>
                          <AppLink
                            id="your-reference-change"
                            href={{
                              pathname: `${process.env.NX_EXPORT_URL}/add-your-own-export-reference`,
                              query: { id },
                            }}
                          >
                            {t('actions.change')}
                          </AppLink>
                        </Actions>
                      </Row>
                    </DefinitionList>
                  </AccordionSection>
                  <AccordionSection
                    title={
                      '1. ' +
                      t('exportJourney.submitAnExport.SectionOne.heading')
                    }
                    expandedAll={expandedAll}
                    id="check-answers-section-about-waste"
                  >
                    {checkYourReportPage.data.wasteDescription.status ===
                      'Complete' && (
                      <>
                        <DefinitionList>
                          <Row>
                            <Key id="waste-code-type-header">
                              {t('exportJourney.checkAnswers.wasteCode')}
                            </Key>
                            <Value>
                              {checkYourReportPage.data?.wasteDescription
                                ?.wasteCode.type === 'NotApplicable' && (
                                <span>{t('notApplicable')}</span>
                              )}
                              {checkYourReportPage.data?.wasteDescription
                                ?.wasteCode.type !== 'NotApplicable' && (
                                <>
                                  <WasteCodeType id="waste-code-type">
                                    {
                                      checkYourReportPage.data?.wasteDescription
                                        ?.wasteCode.type
                                    }
                                  </WasteCodeType>
                                  <span>
                                    {boldUpToFirstColon(
                                      checkYourReportPage.data?.wasteDescription
                                        ?.wasteCode.value
                                    )}
                                  </span>
                                </>
                              )}
                            </Value>

                            <Actions>
                              <AppLink
                                id="waste-code-type-change"
                                href={{
                                  pathname: `${process.env.NX_EXPORT_URL}/changing-waste-code`,
                                  query: { id },
                                }}
                              >
                                {t('actions.change')}
                              </AppLink>
                            </Actions>
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
                                {checkYourReportPage.data?.wasteDescription?.ewcCodes?.map(
                                  (item, index) => (
                                    <GovUK.ListItem key={index}>
                                      {boldUpToFirstColon(item)}
                                    </GovUK.ListItem>
                                  )
                                )}
                                {checkYourReportPage.data?.wasteDescription
                                  ?.ewcCodes.length === 0 && (
                                  <span id="ewc-not-provided">
                                    {t(
                                      'exportJourney.checkAnswers.notProvided'
                                    )}
                                  </span>
                                )}
                              </GovUK.UnorderedList>
                            </Value>
                            <Actions>
                              <AppLink
                                id="ewc-codes-change"
                                href={{
                                  pathname: `${process.env.NX_EXPORT_URL}/added-ewc-code`,
                                  query: { id },
                                }}
                              >
                                {t('actions.change')}
                              </AppLink>
                            </Actions>
                          </Row>

                          <Row>
                            <Key id="national-code-header">
                              {t('exportJourney.checkAnswers.nationalCode')}
                            </Key>
                            <Value id="national-code">
                              {checkYourReportPage.data.wasteDescription
                                ?.nationalCode.provided === 'Yes' && (
                                <span>
                                  {
                                    checkYourReportPage.data?.wasteDescription
                                      ?.nationalCode.value
                                  }
                                </span>
                              )}
                              {checkYourReportPage.data.wasteDescription
                                ?.nationalCode.provided === 'No' && (
                                <span>
                                  {t('exportJourney.checkAnswers.notProvided')}
                                </span>
                              )}
                            </Value>
                            <Actions>
                              <AppLink
                                id="national-code-change"
                                href={{
                                  pathname: `${process.env.NX_EXPORT_URL}/national-code`,
                                  query: { id },
                                }}
                              >
                                {t('actions.change')}
                              </AppLink>
                            </Actions>
                          </Row>

                          <Row>
                            <Key id="waste-description-header">
                              {t('exportJourney.checkAnswers.wasteDescription')}
                            </Key>
                            <Value id="waste-description">
                              <BreakableString>
                                {
                                  checkYourReportPage.data?.wasteDescription
                                    ?.description
                                }
                              </BreakableString>
                            </Value>
                            <Actions>
                              <AppLink
                                id="waste-destription-change"
                                href={{
                                  pathname: `${process.env.NX_EXPORT_URL}/describe-waste`,
                                  query: { id },
                                }}
                              >
                                {t('actions.change')}
                              </AppLink>
                            </Actions>
                          </Row>

                          {checkYourReportPage.data.wasteQuantity.status ===
                            'Complete' && (
                            <>
                              <Row>
                                <Key id="waste-quanitity-header">
                                  {t(
                                    'exportJourney.checkAnswers.wasteQuantity'
                                  )}
                                </Key>
                                {checkYourReportPage?.data.wasteQuantity
                                  .value && (
                                  <Value id="waste-quanitity">
                                    {checkYourReportPage?.data?.wasteQuantity
                                      .value.type === 'EstimateData' && (
                                      <b>
                                        {t(
                                          'exportJourney.checkAnswers.estimated'
                                        )}
                                        <br />
                                      </b>
                                    )}
                                    {checkYourReportPage.data.wasteQuantity
                                      .value.type !== 'NotApplicable' &&
                                      checkYourReportPage.data?.wasteQuantity
                                        ?.value.type === 'EstimateData' && (
                                        <span>
                                          {
                                            checkYourReportPage?.data
                                              .wasteQuantity.value.estimateData
                                              .value
                                          }
                                        </span>
                                      )}
                                    {checkYourReportPage.data.wasteQuantity
                                      .value.type !== 'NotApplicable' &&
                                      checkYourReportPage.data?.wasteQuantity
                                        ?.value.type === 'ActualData' && (
                                        <span>
                                          {
                                            checkYourReportPage?.data
                                              .wasteQuantity.value.actualData
                                              .value
                                          }
                                        </span>
                                      )}

                                    {checkYourReportPage.data.wasteDescription
                                      .wasteCode.type !== 'NotApplicable' ? (
                                      <UnitDisplay
                                        quantityType={quantityType()}
                                        type={
                                          checkYourReportPage.data
                                            ?.wasteDescription.wasteCode.type
                                        }
                                      />
                                    ) : (
                                      <span> {t('weight.kg')}</span>
                                    )}
                                  </Value>
                                )}
                                <Actions>
                                  <AppLink
                                    id="waste-quanitity-change"
                                    href={{
                                      pathname: `${process.env.NX_EXPORT_URL}/waste-quantity`,
                                      query: { id },
                                    }}
                                  >
                                    {t('actions.change')}
                                  </AppLink>
                                </Actions>
                              </Row>
                            </>
                          )}
                        </DefinitionList>
                      </>
                    )}
                  </AccordionSection>
                  <AccordionSection
                    title={
                      '2. ' +
                      t('exportJourney.submitAnExport.SectionTwo.heading')
                    }
                    expandedAll={expandedAll}
                    id="check-answers-section-export-import"
                  >
                    {checkYourReportPage.data.exporterDetail.status ===
                      'Complete' && (
                      <>
                        <GovUK.H3>
                          {t(
                            'exportJourney.submitAnExport.SectionTwo.exporterDetails'
                          )}
                        </GovUK.H3>
                        <DefinitionList>
                          <Row>
                            <Key id="exporter-address-header">
                              {t('address')}
                            </Key>
                            <Value id="exporter-address">
                              {
                                checkYourReportPage.data?.exporterDetail
                                  ?.exporterAddress.addressLine1
                              }
                              <br />
                              {
                                checkYourReportPage.data?.exporterDetail
                                  ?.exporterAddress.addressLine2
                              }
                              <br />
                              {
                                checkYourReportPage.data?.exporterDetail
                                  ?.exporterAddress.townCity
                              }
                              <br />
                              {
                                checkYourReportPage.data?.exporterDetail
                                  ?.exporterAddress.postcode
                              }
                            </Value>

                            <Actions>
                              <AppLink
                                id="exporter-address-change"
                                href={{
                                  pathname: `${process.env.NX_EXPORT_URL}/exporter-details-manual`,
                                  query: { id },
                                }}
                              >
                                {t('actions.change')}
                              </AppLink>
                            </Actions>
                          </Row>

                          <Row>
                            <Key id="exporter-country-header">
                              {t('address.country')}
                            </Key>
                            <Value id="exporter-country">
                              {
                                checkYourReportPage.data?.exporterDetail
                                  ?.exporterAddress.country
                              }
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
                                checkYourReportPage.data?.exporterDetail
                                  ?.exporterContactDetails.organisationName
                              }
                            </Value>
                            <Actions>
                              <AppLink
                                id="exporter-organisation-name-change"
                                href={{
                                  pathname: `${process.env.NX_EXPORT_URL}/exporter-details`,
                                  query: { id },
                                }}
                              >
                                {t('actions.change')}
                              </AppLink>
                            </Actions>
                          </Row>

                          {/*  Full name */}

                          <Row>
                            <Key id="exporter-full-name-header">
                              {t('contact.fullName')}
                            </Key>
                            <Value id="exporter-full-name">
                              {
                                checkYourReportPage.data?.exporterDetail
                                  ?.exporterContactDetails.fullName
                              }
                            </Value>
                          </Row>
                          {/*  Email address */}

                          <Row>
                            <Key id="exporter-email-header">
                              {t('contact.emailAddress')}
                            </Key>
                            <Value id="exporter-email">
                              <BreakableString>
                                {
                                  checkYourReportPage.data?.exporterDetail
                                    ?.exporterContactDetails.emailAddress
                                }
                              </BreakableString>
                            </Value>
                          </Row>

                          <Row>
                            <Key id="exporter-phone-header">
                              {t('contact.phoneNumber')}
                            </Key>
                            <Value id="exporter-phone">
                              {
                                checkYourReportPage.data?.exporterDetail
                                  ?.exporterContactDetails.phoneNumber
                              }
                            </Value>
                          </Row>

                          <Row>
                            <Key id="exporter-fax-header">
                              {t('contact.faxNumber')}
                            </Key>
                            <Value id="exporter-fax">
                              {checkYourReportPage.data?.exporterDetail
                                ?.exporterContactDetails.faxNumber && (
                                <span>
                                  {
                                    checkYourReportPage.data?.exporterDetail
                                      ?.exporterContactDetails.faxNumber
                                  }
                                </span>
                              )}
                              {!checkYourReportPage.data?.exporterDetail
                                ?.exporterContactDetails.faxNumber && (
                                <span>
                                  {t('exportJourney.checkAnswers.notProvided')}
                                </span>
                              )}
                            </Value>
                          </Row>
                          <SectionBreak />
                        </DefinitionList>
                      </>
                    )}

                    {checkYourReportPage.data.importerDetail.status ===
                      'Complete' && (
                      <>
                        {/* IMPORTER */}
                        <GovUK.H3>
                          {t(
                            'exportJourney.submitAnExport.SectionTwo.importerDetails'
                          )}
                        </GovUK.H3>
                        <DefinitionList>
                          <Row>
                            <Key id="importer-organisation-name-header">
                              {t('contact.orgName')}
                            </Key>
                            <Value id="importer-organisation-name">
                              {
                                checkYourReportPage.data?.importerDetail
                                  ?.importerAddressDetails.organisationName
                              }
                            </Value>
                            <Actions>
                              <AppLink
                                id="importer-details-change"
                                href={{
                                  pathname: `${process.env.NX_EXPORT_URL}/importer-details`,
                                  query: { id },
                                }}
                              >
                                {t('actions.change')}
                              </AppLink>
                            </Actions>
                          </Row>
                          <Row>
                            <Key id="importer-address-header">
                              {t('address')}
                            </Key>
                            <Value id="importer-address">
                              {
                                checkYourReportPage.data?.importerDetail
                                  ?.importerAddressDetails.address
                              }
                            </Value>
                          </Row>
                          {/* COUNTRY */}
                          <Row>
                            <Key id="importer-country-header">
                              {t('address.country')}
                            </Key>
                            <Value id="importer-country">
                              {
                                checkYourReportPage.data?.importerDetail
                                  ?.importerAddressDetails.country
                              }
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
                              {
                                checkYourReportPage.data?.importerDetail
                                  ?.importerContactDetails.fullName
                              }
                            </Value>
                            <Actions>
                              <AppLink
                                id="importer-contact-details-change"
                                href={{
                                  pathname: `${process.env.NX_EXPORT_URL}/importer-contact-details`,
                                  query: { id },
                                }}
                              >
                                {t('actions.change')}
                              </AppLink>
                            </Actions>
                          </Row>
                          {/*  Email address */}
                          <Row>
                            <Key id="importer-email-header">
                              {t('contact.emailAddress')}
                            </Key>
                            <Value id="importer-email">
                              {
                                checkYourReportPage.data?.importerDetail
                                  ?.importerContactDetails.emailAddress
                              }
                            </Value>
                          </Row>
                          <Row>
                            <Key id="importer-phone-header">
                              {t('contact.phoneNumber')}
                            </Key>
                            <Value id="importer-phone">
                              {
                                checkYourReportPage.data?.importerDetail
                                  ?.importerContactDetails.phoneNumber
                              }
                            </Value>
                          </Row>
                          <Row>
                            <Key id="importer-fax-header">
                              {t('contact.faxNumber')}
                            </Key>
                            <Value id="importer-fax">
                              {checkYourReportPage.data?.importerDetail
                                ?.importerContactDetails.faxNumber && (
                                <span>
                                  {
                                    checkYourReportPage.data?.importerDetail
                                      ?.importerContactDetails.faxNumber
                                  }
                                </span>
                              )}
                              {!checkYourReportPage.data?.importerDetail
                                ?.importerContactDetails.faxNumber && (
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
                    title={
                      '3. ' +
                      t('exportJourney.submitAnExport.SectionThree.heading')
                    }
                    expandedAll={expandedAll}
                    id="check-answers-section-journey"
                  >
                    {checkYourReportPage.data.collectionDate.status ===
                      'Complete' && (
                      <>
                        <DefinitionList>
                          <Row>
                            <Key id="collection-date-header">
                              {t(
                                'exportJourney.submitAnExport.SectionThree.collectionDate'
                              )}
                            </Key>

                            {checkYourReportPage.data?.collectionDate.value
                              .type === 'EstimateDate' && (
                              <Value id="collection-date">
                                <div>
                                  <b>
                                    {t('exportJourney.checkAnswers.estimated')}
                                  </b>
                                  <br />
                                </div>

                                {format(
                                  new Date(
                                    Number(
                                      checkYourReportPage.data.collectionDate
                                        .value.estimateDate.year
                                    ),
                                    Number(
                                      checkYourReportPage.data.collectionDate
                                        .value.estimateDate.month
                                    ) - 1,
                                    Number(
                                      checkYourReportPage.data.collectionDate
                                        .value.estimateDate.day
                                    )
                                  ),
                                  'd MMMM y'
                                )}
                              </Value>
                            )}

                            {checkYourReportPage.data?.collectionDate.value
                              .type === 'ActualDate' && (
                              <Value id="collection-date">
                                {format(
                                  new Date(
                                    Number(
                                      checkYourReportPage.data.collectionDate
                                        .value.actualDate.year
                                    ),
                                    Number(
                                      checkYourReportPage.data.collectionDate
                                        .value.actualDate.month
                                    ) - 1,
                                    Number(
                                      checkYourReportPage.data.collectionDate
                                        .value.actualDate.day
                                    )
                                  ),
                                  'd MMMM y'
                                )}
                              </Value>
                            )}

                            <Actions>
                              <AppLink
                                id="collection-date-change"
                                href={{
                                  pathname: `${process.env.NX_EXPORT_URL}/waste-collection-date`,
                                  query: { id, dashboard: true },
                                }}
                              >
                                {t('actions.change')}
                              </AppLink>
                            </Actions>
                          </Row>
                          <SectionBreak />
                        </DefinitionList>
                      </>
                    )}
                    {checkYourReportPage.data.carriers.status ===
                      'Complete' && (
                      <>
                        {checkYourReportPage.data?.carriers.values?.map(
                          (item, index) => (
                            <div id={'carrier-' + index} key={index}>
                              <GovUK.H3>
                                {checkYourReportPage.data.carriers.status ===
                                  'Complete' && (
                                  <>
                                    <WasteCarrierHeading
                                      index={index}
                                      noOfCarriers={
                                        checkYourReportPage.data?.carriers
                                          .values.length
                                      }
                                    />
                                  </>
                                )}
                              </GovUK.H3>
                              <DefinitionList>
                                <Row>
                                  <Key
                                    id={
                                      'carrier-organisation-name-header' + index
                                    }
                                  >
                                    {t(
                                      'exportJourney.checkAnswers.organasiationName'
                                    )}
                                  </Key>
                                  <Value
                                    id={'carrier-organisation-name' + index}
                                  >
                                    {item.addressDetails?.organisationName}
                                  </Value>
                                  <Actions>
                                    <AppLink
                                      id={'carrier-change' + index}
                                      href={
                                        process.env.NX_EXPORT_URL +
                                        '/waste-carrier-details?id=' +
                                        id +
                                        '&carrierId=' +
                                        item.id
                                      }
                                    >
                                      {t('actions.change')}
                                    </AppLink>
                                  </Actions>
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
                                  <Actions>
                                    <AppLink
                                      id={
                                        'carrier-contact-details-change' + index
                                      }
                                      href={
                                        process.env.NX_EXPORT_URL +
                                        '/waste-carrier-contact-details?id=' +
                                        id +
                                        '&carrierId=' +
                                        item.id
                                      }
                                    >
                                      {t('actions.change')}
                                    </AppLink>
                                  </Actions>
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
                                      <span>
                                        {item.contactDetails?.faxNumber}
                                      </span>
                                    )}
                                    {!item.contactDetails?.faxNumber && (
                                      <span>
                                        {t(
                                          'exportJourney.checkAnswers.notProvided'
                                        )}
                                      </span>
                                    )}
                                  </Value>
                                </Row>
                                {item.transportDetails?.type && (
                                  <>
                                    <Row>
                                      <Key id={'carrier-type-header' + index}>
                                        {t(
                                          'exportJourney.checkAnswers.transportOfWaste'
                                        )}
                                      </Key>
                                      <Value id={'carrier-type' + index}>
                                        {item.transportDetails?.type}
                                      </Value>
                                      <Actions>
                                        <AppLink
                                          id={'carrier-type-change' + index}
                                          href={
                                            '/waste-carrier-transport-choice?id=' +
                                            id +
                                            '&carrierId=' +
                                            item.id
                                          }
                                        >
                                          {t('actions.change')}
                                        </AppLink>
                                      </Actions>
                                    </Row>

                                    {item.transportDetails?.type ===
                                      'ShippingContainer' && (
                                      <>
                                        <Row>
                                          <Key
                                            id={
                                              'carrier-shipping-container-number-header' +
                                              index
                                            }
                                          >
                                            {t(
                                              'exportJourney.checkAnswers.shippingContainerNumber'
                                            )}
                                          </Key>
                                          <Value
                                            id={
                                              'carrier-shipping-container-number' +
                                              index
                                            }
                                          >
                                            {
                                              item.transportDetails
                                                ?.shippingContainerNumber
                                            }
                                          </Value>
                                          <Actions>
                                            {' '}
                                            <AppLink
                                              id={
                                                'carrier-details-change' + index
                                              }
                                              href={
                                                '/waste-carrier-shipping-container?id=' +
                                                id +
                                                '&carrierId=' +
                                                item.id
                                              }
                                            >
                                              {t('actions.change')}
                                            </AppLink>
                                          </Actions>
                                        </Row>
                                        <Row>
                                          <Key
                                            id={
                                              'carrier-vehicle-registration-header' +
                                              index
                                            }
                                          >
                                            {t(
                                              'exportJourney.checkAnswers.vehichleRegO'
                                            )}
                                          </Key>
                                          <Value
                                            id={
                                              'carrier-vehicle-registration' +
                                              index
                                            }
                                          >
                                            {item.transportDetails
                                              ?.vehicleRegistration && (
                                              <span>
                                                {
                                                  item.transportDetails
                                                    ?.vehicleRegistration
                                                }
                                              </span>
                                            )}
                                            {!item.transportDetails
                                              ?.vehicleRegistration && (
                                              <span>
                                                {t(
                                                  'exportJourney.checkAnswers.notProvided'
                                                )}
                                              </span>
                                            )}
                                          </Value>
                                        </Row>
                                        <SectionBreak />
                                      </>
                                    )}

                                    {item.transportDetails?.type ===
                                      'Trailer' && (
                                      <>
                                        <Row>
                                          <Key
                                            id={
                                              'carrier-vehicle-registration-header' +
                                              index
                                            }
                                          >
                                            {t(
                                              'exportJourney.checkAnswers.vehichleReg'
                                            )}
                                          </Key>
                                          <Value
                                            id={
                                              'carrier-vehicle-registration' +
                                              index
                                            }
                                          >
                                            {item.transportDetails
                                              ?.vehicleRegistration && (
                                              <span>
                                                {
                                                  item.transportDetails
                                                    ?.vehicleRegistration
                                                }
                                              </span>
                                            )}
                                            {!item.transportDetails
                                              ?.vehicleRegistration && (
                                              <span>
                                                {t(
                                                  'exportJourney.checkAnswers.notProvided'
                                                )}
                                              </span>
                                            )}
                                          </Value>
                                          <Actions>
                                            {' '}
                                            <AppLink
                                              id={
                                                'carrier-details-change' + index
                                              }
                                              href={
                                                '/waste-carrier-trailer?id=' +
                                                id +
                                                '&carrierId=' +
                                                item.id
                                              }
                                            >
                                              {t('actions.change')}
                                            </AppLink>
                                          </Actions>
                                        </Row>

                                        <Row>
                                          <Key
                                            id={
                                              'carrier-trailer-number-header' +
                                              index
                                            }
                                          >
                                            {t(
                                              'exportJourney.checkAnswers.trailerO'
                                            )}
                                          </Key>
                                          <Value
                                            id={
                                              'carrier-trailer-number' + index
                                            }
                                          >
                                            {item.transportDetails
                                              ?.trailerNumber && (
                                              <span>
                                                {
                                                  item.transportDetails
                                                    ?.trailerNumber
                                                }
                                              </span>
                                            )}
                                            {!item.transportDetails
                                              ?.trailerNumber && (
                                              <span>
                                                {t(
                                                  'exportJourney.checkAnswers.notProvided'
                                                )}
                                              </span>
                                            )}
                                          </Value>
                                        </Row>
                                        <SectionBreak />
                                      </>
                                    )}

                                    {item.transportDetails?.type ===
                                      'BulkVessel' && (
                                      <>
                                        <Row>
                                          <Key
                                            id={'carrier-imo-header' + index}
                                          >
                                            {t(
                                              'exportJourney.checkAnswers.IMO'
                                            )}
                                          </Key>
                                          <Value id={'carrier-imo' + index}>
                                            {item.transportDetails?.imo}
                                          </Value>
                                          <Actions>
                                            {' '}
                                            <AppLink
                                              id={
                                                'carrier-details-change' + index
                                              }
                                              href={
                                                '/waste-carrier-bulk-vessel?id=' +
                                                id +
                                                '&carrierId=' +
                                                item.id
                                              }
                                            >
                                              {t('actions.change')}
                                            </AppLink>
                                          </Actions>
                                        </Row>
                                        <SectionBreak />
                                      </>
                                    )}
                                  </>
                                )}
                              </DefinitionList>
                            </div>
                          )
                        )}
                      </>
                    )}
                    {checkYourReportPage.data.collectionDetail.status ===
                      'Complete' && (
                      <>
                        {/* WCD */}
                        <GovUK.H3>
                          {t('exportJourney.wasteCollectionDetails.caption')}
                        </GovUK.H3>
                        <DefinitionList>
                          <Row>
                            <Key id="waste-collection-address-header">
                              {t('address')}
                            </Key>
                            <Value id="waste-collection-address">
                              {
                                checkYourReportPage.data?.collectionDetail
                                  ?.address.addressLine1
                              }
                              <br />
                              {
                                checkYourReportPage.data?.collectionDetail
                                  ?.address.addressLine2
                              }
                              <br />
                              {
                                checkYourReportPage.data?.collectionDetail
                                  ?.address.townCity
                              }
                              <br />
                              {
                                checkYourReportPage.data?.collectionDetail
                                  ?.address.postcode
                              }
                              <br />
                            </Value>

                            <Actions>
                              <AppLink
                                id="waste-collection-address-change"
                                href={{
                                  pathname: `${process.env.NX_EXPORT_URL}/waste-collection`,
                                  query: { id, page: 'MANUAL_ADDRESS' },
                                }}
                              >
                                {t('actions.change')}
                              </AppLink>
                            </Actions>
                          </Row>

                          <Row>
                            <Key id="waste-collection-country-header">
                              {t('address.country')}
                            </Key>
                            <Value id="waste-collection-country">
                              {
                                checkYourReportPage.data?.collectionDetail
                                  ?.address.country
                              }
                              <br />
                            </Value>
                          </Row>
                          <SectionBreak />
                          <Row>
                            <Key id="waste-collection-full-name-header">
                              {t(
                                'exportJourney.checkAnswers.organasiationName'
                              )}
                            </Key>
                            <Value id="waste-collection-full-name">
                              {
                                checkYourReportPage.data?.collectionDetail
                                  ?.contactDetails.organisationName
                              }
                            </Value>
                            <Actions>
                              <AppLink
                                id="waste-collection-full-name-change"
                                href={{
                                  pathname: `${process.env.NX_EXPORT_URL}/waste-collection`,
                                  query: { id },
                                }}
                              >
                                {t('actions.change')}
                              </AppLink>
                            </Actions>
                          </Row>

                          <Row>
                            <Key id="waste-collection-contact-person-header">
                              {t('contact.person')}
                            </Key>
                            <Value id="waste-collection-contact-person">
                              {
                                checkYourReportPage.data?.collectionDetail
                                  ?.contactDetails.fullName
                              }
                            </Value>
                          </Row>
                          {/*  Email address */}

                          <Row>
                            <Key id="waste-collection-email-header">
                              {t('contact.emailAddress')}
                            </Key>
                            <Value id="waste-collection-email">
                              {
                                checkYourReportPage.data?.collectionDetail
                                  ?.contactDetails.emailAddress
                              }
                            </Value>
                          </Row>

                          <Row>
                            <Key id="waste-collection-phone-header">
                              {t('contact.phoneNumber')}
                            </Key>
                            <Value id="waste-collection-phone">
                              {
                                checkYourReportPage.data?.collectionDetail
                                  ?.contactDetails.phoneNumber
                              }
                            </Value>
                          </Row>

                          <Row>
                            <Key id="waste-collection-fax-header">
                              {t('contact.faxNumber')}
                            </Key>
                            <Value id="waste-collection-fax">
                              {
                                checkYourReportPage.data?.collectionDetail
                                  ?.contactDetails.faxNumber
                              }

                              {checkYourReportPage.data?.collectionDetail
                                ?.contactDetails.faxNumber === undefined
                                ? t('exportJourney.checkAnswers.notProvided')
                                : checkYourReportPage.data?.collectionDetail
                                    ?.contactDetails.faxNumber}
                            </Value>
                          </Row>
                          <SectionBreak />
                        </DefinitionList>
                      </>
                    )}
                    {checkYourReportPage.data.ukExitLocation.status ===
                      'Complete' && (
                      <>
                        <GovUK.H3>
                          {t('exportJourney.pointOfExit.caption')}
                        </GovUK.H3>
                        <DefinitionList>
                          <Row>
                            <Key id="exit-location-header">{t('location')}</Key>
                            <Value id="exit-location">
                              {checkYourReportPage.data?.ukExitLocation
                                ?.exitLocation.provided === 'Yes' && (
                                <span>
                                  {
                                    checkYourReportPage.data?.ukExitLocation
                                      ?.exitLocation.value
                                  }
                                </span>
                              )}
                              {checkYourReportPage.data?.ukExitLocation
                                ?.exitLocation.provided === 'No' && (
                                <span id="exit-location-not-provided">
                                  {t('exportJourney.checkAnswers.notProvided')}
                                </span>
                              )}

                              <br />
                            </Value>

                            <Actions>
                              <AppLink
                                id="exit-location-change"
                                href={{
                                  pathname: `${process.env.NX_EXPORT_URL}/waste-exit-location`,
                                  query: { id },
                                }}
                              >
                                {t('actions.change')}
                              </AppLink>
                            </Actions>
                          </Row>
                          <SectionBreak />
                        </DefinitionList>
                      </>
                    )}

                    {checkYourReportPage.data.transitCountries.status ===
                      'Complete' && (
                      <>
                        <GovUK.H3>
                          {t('exportJourney.wasteTransitCountries.caption')}
                        </GovUK.H3>
                        <DefinitionList>
                          <Row>
                            <Key id="transit-countries-header">
                              {t(
                                'exportJourney.wasteTransitCountries.listTitle'
                              )}
                            </Key>
                            <Value id="transit-countries">
                              {checkYourReportPage.data?.transitCountries.values
                                .length > 0 && (
                                <GovUK.OrderedList mb={0}>
                                  {checkYourReportPage.data?.transitCountries.values?.map(
                                    (item, index) => (
                                      <GovUK.ListItem key={index}>
                                        {item}
                                      </GovUK.ListItem>
                                    )
                                  )}
                                </GovUK.OrderedList>
                              )}

                              {checkYourReportPage.data?.transitCountries.values
                                .length === 0 && (
                                <span id="transit-countries-not-provided">
                                  {t('exportJourney.checkAnswers.notProvided')}
                                </span>
                              )}
                            </Value>

                            <Actions>
                              <AppLink
                                id="transit-countries-change"
                                href={{
                                  pathname: `${process.env.NX_EXPORT_URL}/waste-transit-countries`,
                                  query: { id },
                                }}
                              >
                                {t('actions.change')}
                              </AppLink>
                            </Actions>
                          </Row>
                        </DefinitionList>
                      </>
                    )}
                  </AccordionSection>
                  <AccordionSection
                    title={
                      '4. ' +
                      t('exportJourney.submitAnExport.SectionFour.heading')
                    }
                    expandedAll={expandedAll}
                    id="check-answers-section-treatment"
                  >
                    {checkYourReportPage.data.recoveryFacilityDetail.status ===
                      'Complete' && (
                      <>
                        {checkYourReportPage.data.recoveryFacilityDetail.values
                          .filter(
                            (site) =>
                              site.recoveryFacilityType?.type === 'Laboratory'
                          )
                          .map((filteredSite, index) => (
                            <SiteDetails
                              site={filteredSite}
                              index={index}
                              id={id}
                              key={`lab${index}`}
                            />
                          ))}

                        {checkYourReportPage.data.recoveryFacilityDetail.values
                          .filter(
                            (site) =>
                              site.recoveryFacilityType?.type === 'InterimSite'
                          )
                          .map((filteredSite, index) => (
                            <>
                              <SiteDetails
                                site={filteredSite}
                                index={index}
                                id={id}
                                key={`interimSite${index}`}
                              />
                            </>
                          ))}

                        {checkYourReportPage.data.recoveryFacilityDetail.values
                          .filter(
                            (site) =>
                              site.recoveryFacilityType?.type ===
                              'RecoveryFacility'
                          )
                          .map((filteredSite, index) => (
                            <SiteDetails
                              site={filteredSite}
                              index={index}
                              id={id}
                              key={`recFac${index}`}
                              multiple={
                                checkYourReportPage.data.recoveryFacilityDetail
                                  .status === 'Complete' &&
                                checkYourReportPage.data.recoveryFacilityDetail.values.filter(
                                  (site) =>
                                    site.recoveryFacilityType?.type ===
                                    'RecoveryFacility'
                                ).length > 1
                              }
                            />
                          ))}
                      </>
                    )}
                  </AccordionSection>
                </Accordion>
              </GovUK.GridCol>
            </GovUK.GridRow>
            {/* sign-declaration */}
            <ButtonGroup>
              <GovUK.Button id="saveButton" onClick={handleSubmit}>
                {t('exportJourney.checkAnswers.conformButton')}
              </GovUK.Button>
              <SaveReturnButton
                onClick={() =>
                  router.push({
                    pathname: `${process.env.NX_EXPORT_URL}`,
                    query: { id },
                  })
                }
              >
                {t('exportJourney.checkAnswers.returnButton')}
              </SaveReturnButton>
            </ButtonGroup>
          </>
        )}
      </GovUK.Page>
    </>
  );
};

const SiteDetails = ({ site, index, id, multiple = false }) => {
  const { t } = useTranslation();
  const type = site.recoveryFacilityType.type;
  let titleKey, nameKey, codeKey, url, code;

  switch (type) {
    case 'Laboratory':
      titleKey = 'exportJourney.checkAnswers.titleLaboratory';
      nameKey = 'exportJourney.laboratorySite.name';
      url = '/laboratory-details';
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
        : index === 0
        ? 'exportJourney.recoveryFacilities.firstCardTitle'
        : 'exportJourney.recoveryFacilities.secondCardTitle';
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
          <Actions>
            <AppLink
              href={{
                pathname: `${process.env.NX_EXPORT_URL}/${url}`,
                query: { id, site: site.id, page: 'ADDRESS_DETAILS' },
              }}
              id={`${type.toLowerCase()}-change-address-${index}`}
            >
              {t('actions.change')}
            </AppLink>
          </Actions>
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
          <Actions>
            <AppLink
              href={{
                pathname: `${process.env.NX_EXPORT_URL}/${url}`,
                query: { id, site: site.id, page: 'CONTACT_DETAILS' },
              }}
              id={`${type.toLowerCase()}-change-contact-${index}`}
            >
              {t('actions.change')}
            </AppLink>
          </Actions>
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
            {boldUpToFirstColon(code)}
          </Value>
          <Actions>
            <AppLink
              href={{
                pathname: `${process.env.NX_EXPORT_URL}/${url}`,
                query: { id, site: site.id, page: 'RECOVERY_CODE' },
              }}
              id={`${type.toLowerCase()}-change-code-${index}`}
            >
              {t('actions.change')}
            </AppLink>
          </Actions>
        </Row>
      </DefinitionList>
      {multiple && index === 0 && <SectionBreak />}
    </div>
  );
};

export default CheckYourReport;
