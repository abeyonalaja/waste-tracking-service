import PDFLayout from '../components/PDFLayout';
import React, { useEffect, useState, useReducer } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import '../i18n/config';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Submission } from '@wts/api/waste-tracking-gateway';
import { format } from 'date-fns';
import { UnitDisplay } from '../components';

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

const downloadReportReducer = (state: State, action: Action) => {
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

const Page = styled.div`
  background: #fff;
  min-height: 300px;
  font-size: 11px;
  padding: 5px;
  * {
    font-family: Arial !important;
    line-height: 1.2;
  }
  @media screen {
    width: 960px;
    margin: 0 auto;
    border: 1px solid #ccc;
    padding: 5px 10px;
  }
`;

const PageHeader = styled.div`
  text-align: center;
  text-transform: uppercase;
  font-weight: bold;
  font-size: 13px;
  > p {
    margin: 0;
  }
`;

const H1 = styled.h1`
  text-decoration: underline;
  font-size: 13px;
  margin: 0 0 10px;
`;

const H2 = styled.div`
  page-break-before: always;
`;

const Line = styled.span`
  display: block;
  border-bottom: 2px solid #000;
  height: 0px;
  margin: 10px -5px;
`;

const Row = styled.div`
  border-top: 2px solid #000;
  border-left: 2px solid #000;
  border-bottom: 2px solid #000;
  position: relative;
  margin-top: -2px;
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 1fr;
`;

const GridRow = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 1fr;
`;

const Box = styled.div`
  display: block;
  border-right: 2px solid #000;
  padding: 5px;
`;

const SectionTitle = styled.span`
  display: block;
  font-weight: bold;
`;

const InlineSectionTitle = styled.span`
  display: inline-block;
  font-weight: bold;
`;

const DataRow = styled.span`
  display: block;
  margin: 2px 0;
`;

const Label = styled.span`
  color: #333;
  display: inline;
  padding-right: 5px;
  font-style: italic;
  &:after {
    content: ':';
  }
`;

const SignName = styled.span`
  color: #333;
  display: inline;
  padding-right: 5px;
  font-style: italic;
  &:after {
    content: ': ___________________________________';
  }
`;

const SignDate = styled.span`
  color: #333;
  display: inline;
  padding-right: 5px;
  font-style: italic;
  &:after {
    content: ': __________________';
  }
`;

const SignSignature = styled.span`
  color: #333;
  display: inline;
  padding-right: 5px;
  font-style: italic;
  &:after {
    content: ': _________________________________________';
  }
`;

const Value = styled.span`
  display: inline;
`;

const Warning = styled.span`
  display: block;
  font-weight: bold;
  text-align: center;
  text-transform: uppercase;
`;

const Meta = styled.span`
  font-size: 11px;
  padding: 5px 0;
  display: block;
  ol {
    font-size: 11px;
    margin: 0;
    padding: 0;
    list-style: none;
    counter-reset: list;
    li {
      font-size: 11px;
      padding-left: 15px;
      position: relative;
      margin-bottom: 3px;
      &:before {
        content: '(' counter(list) ') ';
        counter-increment: list;
        position: absolute;
        left: 0;
        top: 0;
      }
    }
  }
`;

const Table = styled.table`
  width: calc(100% + 12px);
  border-top: 1px solid #000;
  border-left: 1px solid #000;
  border-collapse: collapse;
  margin: 0 -6px -6px -6px;
  th,
  td {
    text-align: center;
    font-weight: normal;
    border-bottom: 1px solid #000;
    border-right: 1px solid #000;
  }
`;

const CommaList = styled.span`
  span {
    &:after {
      content: ', ';
    }
    &:last-child:after {
      content: '';
    }
  `;

const Ref = styled.sup`
  font-weight: normal;
  font-style: italic;
`;

const DownloadReport = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [downloadReport, dispatchDownloadReport] = useReducer(
    downloadReportReducer,
    initialWasteDescState
  );
  const [id, setId] = useState(null);

  useEffect(() => {
    if (router.isReady) {
      setId(router.query.id);
    }
  }, [router.isReady, router.query.id]);

  useEffect(() => {
    dispatchDownloadReport({ type: 'DATA_FETCH_INIT' });
    if (id !== null) {
      fetch(`${process.env.NX_API_GATEWAY_URL}/submissions/${id}`)
        .then((response) => {
          if (response.ok) return response.json();
          else {
            dispatchDownloadReport({ type: 'DATA_FETCH_FAILURE' });
          }
        })
        .then((data) => {
          if (data !== undefined) {
            dispatchDownloadReport({
              type: 'DATA_FETCH_SUCCESS',
              payload: data,
            });
          }
        });
    }
  }, [router.isReady, id]);

  useEffect(() => {
    if (downloadReport.data !== null) {
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
    }
  }, [downloadReport.data, id, router]);

  const isSectionComplete = (sections) => {
    const completedSections = sections.filter((section) => {
      return downloadReport.data[section].status === 'Complete';
    });
    return sections.length === completedSections.length;
  };

  return (
    <>
      <Head>
        <title>{t('exportJourney.checkAnswers.pageTitle')}</title>
      </Head>
      {downloadReport.isError && !downloadReport.isLoading && <></>}
      {downloadReport.isLoading && <></>}
      {!downloadReport.isError && !downloadReport.isLoading && (
        <>
          <Page>
            <PageHeader>
              <H1 id="pdf-h1">Annex VII</H1>
              <p id="pdf-intro">
                Information Accompanying Shipments of Waste <br />
                as referred to in Article 3 (2) and (4)
              </p>
            </PageHeader>
            <p id="pdf-sub-heading">
              Consignment information <Ref>(1)</Ref>
            </p>
            <Row>
              {downloadReport.data.exporterDetail.status === 'Complete' && (
                <Box id="pdf-box-1">
                  <SectionTitle id="pdf-box-1-title">
                    1. Person who arranges the shipment (exporter)
                  </SectionTitle>
                  <DataRow>
                    <Label>Name</Label>
                    <Value>
                      {
                        downloadReport.data.exporterDetail
                          .exporterContactDetails.organisationName
                      }
                    </Value>
                  </DataRow>
                  <DataRow>
                    <Label>Address</Label>
                    <Value>
                      {
                        downloadReport.data.exporterDetail.exporterAddress
                          .addressLine1
                      }
                      ,{' '}
                      {
                        downloadReport.data.exporterDetail.exporterAddress
                          .addressLine2
                      }
                      ,{' '}
                      {
                        downloadReport.data.exporterDetail.exporterAddress
                          .townCity
                      }
                      ,{' '}
                      {
                        downloadReport.data.exporterDetail.exporterAddress
                          .postcode
                      }
                    </Value>
                  </DataRow>
                  <DataRow>
                    <Label>Contact person</Label>
                    <Value>
                      {
                        downloadReport.data.exporterDetail
                          .exporterContactDetails.fullName
                      }
                    </Value>
                  </DataRow>
                  <DataRow>
                    <GridRow>
                      <div>
                        <Label>Tel</Label>
                        <Value>
                          {
                            downloadReport.data.exporterDetail
                              .exporterContactDetails.phoneNumber
                          }
                        </Value>
                      </div>
                      <div>
                        <Label>Fax</Label>
                        <Value>
                          {
                            downloadReport.data.exporterDetail
                              .exporterContactDetails.faxNumber
                          }
                        </Value>
                      </div>
                    </GridRow>
                  </DataRow>
                  <DataRow>
                    <Label>Email</Label>
                    <Value>
                      {
                        downloadReport.data.exporterDetail
                          .exporterContactDetails.emailAddress
                      }
                    </Value>
                  </DataRow>
                </Box>
              )}
              {downloadReport.data.importerDetail.status === 'Complete' && (
                <Box id="pdf-box-2">
                  <SectionTitle id="pdf-box-2-title">
                    2. Importer/consignee
                  </SectionTitle>

                  <DataRow>
                    <Label>Name</Label>
                    <Value>
                      {
                        downloadReport.data.importerDetail
                          .importerAddressDetails.organisationName
                      }
                    </Value>
                  </DataRow>
                  <DataRow>
                    <Label>Address</Label>
                    <Value>
                      {
                        downloadReport.data.importerDetail
                          .importerAddressDetails.address
                      }
                    </Value>
                  </DataRow>
                  <DataRow>
                    <Label>Contact person</Label>
                    <Value>
                      {
                        downloadReport.data.importerDetail
                          .importerContactDetails.fullName
                      }
                    </Value>
                  </DataRow>
                  <DataRow>
                    <GridRow>
                      <div>
                        <Label>Tel</Label>
                        <Value>
                          {
                            downloadReport.data.importerDetail
                              .importerContactDetails.phoneNumber
                          }
                        </Value>
                      </div>
                      <div>
                        <Label>Fax</Label>
                        <Value>
                          {
                            downloadReport.data.importerDetail
                              .importerContactDetails.faxNumber
                          }
                        </Value>
                      </div>
                    </GridRow>
                  </DataRow>
                  <DataRow>
                    <Label>Email</Label>
                    <Value>
                      {
                        downloadReport.data.importerDetail
                          .importerContactDetails.emailAddress
                      }
                    </Value>
                  </DataRow>
                </Box>
              )}
            </Row>
            <Row>
              {downloadReport.data.wasteQuantity.status === 'Complete' &&
                downloadReport.data.wasteDescription.status === 'Complete' && (
                  <Box id="pdf-box-3">
                    <InlineSectionTitle id="pdf-box-3-title">
                      3. Actual quantity:{' '}
                    </InlineSectionTitle>
                    <Value>
                      {downloadReport.data.wasteQuantity.value.type ===
                        'EstimateData' && (
                        <Value>
                          {downloadReport.data.wasteDescription.wasteCode
                            .type === 'NotApplicable' ? (
                            <span>&nbsp;kg: __________</span>
                          ) : (
                            <span>
                              &nbsp;Tonnes (Mg): __________ m3: __________
                            </span>
                          )}
                        </Value>
                      )}

                      {downloadReport.data.wasteQuantity.value.type ===
                        'ActualData' && (
                        <span>
                          &nbsp;
                          {
                            downloadReport.data.wasteQuantity.value.actualData
                              .value
                          }
                          <UnitDisplay
                            quantityType={
                              downloadReport.data.wasteQuantity.value.actualData
                                .quantityType
                            }
                            type={
                              downloadReport.data.wasteDescription.wasteCode
                                .type
                            }
                          />
                        </span>
                      )}
                    </Value>
                  </Box>
                )}
              {downloadReport.data.collectionDate.status === 'Complete' && (
                <Box id="pdf-box-4">
                  <InlineSectionTitle id="pdf-box-4-title">
                    4. Actual date of shipment:
                  </InlineSectionTitle>
                  <>
                    {downloadReport.data.collectionDate.value.type ===
                      'ActualDate' && (
                      <Value>
                        <span>
                          &nbsp;
                          {format(
                            new Date(
                              Number(
                                downloadReport.data.collectionDate.value
                                  .actualDate.year
                              ),
                              Number(
                                downloadReport.data.collectionDate.value
                                  .actualDate.month
                              ) - 1,
                              Number(
                                downloadReport.data.collectionDate.value
                                  .actualDate.day
                              )
                            ),
                            'd MMMM y'
                          )}
                        </span>
                      </Value>
                    )}
                  </>
                </Box>
              )}
            </Row>
            {downloadReport.data.carriers.status === 'Complete' && (
              <Row>
                <Box id="pdf-box-5a">
                  <SectionTitle id="pdf-box-5a-title">
                    5.(a) 1<sup>st</sup> carrier <Ref>(2)</Ref>
                  </SectionTitle>
                  <DataRow>
                    <Label>Name</Label>
                    <Value>
                      {
                        downloadReport.data.carriers.values[0].addressDetails
                          .organisationName
                      }
                    </Value>
                  </DataRow>
                  <DataRow>
                    <Label>Address</Label>
                    <Value>
                      {
                        downloadReport.data.carriers.values[0].addressDetails
                          .address
                      }
                    </Value>
                  </DataRow>
                  <DataRow>
                    <Label>Contact person</Label>
                    <Value>
                      {
                        downloadReport.data.carriers.values[0].contactDetails
                          .fullName
                      }
                    </Value>
                  </DataRow>
                  <DataRow>
                    <Label>Tel</Label>
                    <Value>
                      {
                        downloadReport.data.carriers.values[0].contactDetails
                          .phoneNumber
                      }
                    </Value>
                  </DataRow>
                  <DataRow>
                    <Label>Fax</Label>
                    <Value>
                      {
                        downloadReport.data.carriers.values[0].contactDetails
                          .faxNumber
                      }
                    </Value>
                  </DataRow>
                  <DataRow>
                    <Label>Email</Label>
                    <Value>
                      {
                        downloadReport.data.carriers.values[0].contactDetails
                          .emailAddress
                      }
                    </Value>
                  </DataRow>
                  <DataRow>
                    <Label>Means of transport</Label>
                    {downloadReport.data.wasteDescription.status ===
                      'Complete' &&
                      downloadReport.data.wasteDescription.wasteCode.type !==
                        'NotApplicable' && (
                        <Value>
                          {
                            downloadReport.data.carriers.values[0]
                              .transportDetails.type
                          }
                        </Value>
                      )}
                  </DataRow>
                  <DataRow>
                    <Label>Date of transport</Label>
                    <Value></Value>
                  </DataRow>
                  <DataRow>
                    <Label>Signature</Label>
                    <Value></Value>
                  </DataRow>
                </Box>
                <Box id="pdf-box-5b">
                  <SectionTitle id="pdf-box-5b-title">
                    5.(b) 2<sup>nd</sup> carrier
                  </SectionTitle>
                  <DataRow>
                    <Label>Name</Label>
                    <Value>
                      {downloadReport.data.carriers.values.length > 1 &&
                        downloadReport.data.carriers.values[1].addressDetails
                          .organisationName}
                    </Value>
                  </DataRow>
                  <DataRow>
                    <Label>Address</Label>
                    <Value>
                      {downloadReport.data.carriers.values.length > 1 &&
                        downloadReport.data.carriers.values[1].addressDetails
                          .address}
                    </Value>
                  </DataRow>
                  <DataRow>
                    <Label>Contact person</Label>
                    <Value>
                      {downloadReport.data.carriers.values.length > 1 &&
                        downloadReport.data.carriers.values[1].contactDetails
                          .fullName}
                    </Value>
                  </DataRow>
                  <DataRow>
                    <Label>Tel</Label>
                    <Value>
                      {downloadReport.data.carriers.values.length > 1 &&
                        downloadReport.data.carriers.values[1].contactDetails
                          .phoneNumber}
                    </Value>
                  </DataRow>
                  <DataRow>
                    <Label>Fax</Label>
                    <Value>
                      {downloadReport.data.carriers.values.length > 1 &&
                        downloadReport.data.carriers.values[1].contactDetails
                          .faxNumber}
                    </Value>
                  </DataRow>
                  <DataRow>
                    <Label>Email</Label>
                    <Value>
                      {downloadReport.data.carriers.values.length > 1 &&
                        downloadReport.data.carriers.values[1].contactDetails
                          .emailAddress}
                    </Value>
                  </DataRow>
                  <DataRow>
                    <Label>Means of transport</Label>
                    {downloadReport.data.wasteDescription.status ===
                      'Complete' &&
                      downloadReport.data.wasteDescription.wasteCode.type !==
                        'NotApplicable' && (
                        <Value>
                          {downloadReport.data.carriers.values.length > 1 &&
                            downloadReport.data.carriers.values[1]
                              .transportDetails.type}
                        </Value>
                      )}
                  </DataRow>
                  <DataRow>
                    <Label>Date of transport</Label>
                    <Value></Value>
                  </DataRow>
                  <DataRow>
                    <Label>Signature</Label>
                    <Value></Value>
                  </DataRow>
                </Box>
                <Box id="pdf-box-5c">
                  <SectionTitle id="pdf-box-5c-title">
                    5.(c) 3<sup>rd</sup> carrier{' '}
                  </SectionTitle>
                  <DataRow>
                    <Label>Name</Label>
                    <Value>
                      {downloadReport.data.carriers.values.length > 2 &&
                        downloadReport.data.carriers.values[2].addressDetails
                          .organisationName}
                    </Value>
                  </DataRow>
                  <DataRow>
                    <Label>Address</Label>
                    <Value>
                      {downloadReport.data.carriers.values.length > 2 &&
                        downloadReport.data.carriers.values[2].addressDetails
                          .address}
                    </Value>
                  </DataRow>
                  <DataRow>
                    <Label>Contact person</Label>
                    <Value>
                      {downloadReport.data.carriers.values.length > 2 &&
                        downloadReport.data.carriers.values[2].contactDetails
                          .fullName}
                    </Value>
                  </DataRow>
                  <DataRow>
                    <Label>Tel</Label>
                    <Value>
                      {downloadReport.data.carriers.values.length > 2 &&
                        downloadReport.data.carriers.values[2].contactDetails
                          .phoneNumber}
                    </Value>
                  </DataRow>
                  <DataRow>
                    <Label>Fax</Label>
                    <Value>
                      {downloadReport.data.carriers.values.length > 2 &&
                        downloadReport.data.carriers.values[2].contactDetails
                          .faxNumber}
                    </Value>
                  </DataRow>
                  <DataRow>
                    <Label>Email</Label>
                    <Value>
                      {downloadReport.data.carriers.values.length > 2 &&
                        downloadReport.data.carriers.values[2].contactDetails
                          .emailAddress}
                    </Value>
                  </DataRow>
                  <DataRow>
                    <Label>Means of transport</Label>
                    {downloadReport.data.wasteDescription.status ===
                      'Complete' &&
                      downloadReport.data.wasteDescription.wasteCode.type !==
                        'NotApplicable' && (
                        <Value>
                          {downloadReport.data.carriers.values.length > 2 &&
                            downloadReport.data.carriers.values[2]
                              .transportDetails.type}
                        </Value>
                      )}
                  </DataRow>
                  <DataRow>
                    <Label>Date of transport</Label>
                    <Value></Value>
                  </DataRow>
                  <DataRow>
                    <Label>Signature</Label>
                    <Value></Value>
                  </DataRow>
                </Box>
              </Row>
            )}
            <Row>
              <Box id="pdf-box-6">
                <SectionTitle id="pdf-box-6-title">
                  6. Waste generator <Ref>(3)</Ref>
                </SectionTitle>
                <SectionTitle>
                  Original producer(s), new producer(s) or collector:
                </SectionTitle>
                {downloadReport.data.collectionDetail.status === 'Complete' && (
                  <>
                    <DataRow>
                      <Label>Name</Label>
                      <Value>
                        {
                          downloadReport.data.collectionDetail.contactDetails
                            .organisationName
                        }
                      </Value>
                    </DataRow>
                    <DataRow>
                      <Label>Address</Label>
                      <Value>
                        {
                          downloadReport.data.collectionDetail.address
                            .addressLine1
                        }
                        ,{' '}
                        {
                          downloadReport.data.collectionDetail.address
                            .addressLine2
                        }
                        ,{' '}
                        {downloadReport.data.collectionDetail.address.townCity},{' '}
                        {downloadReport.data.collectionDetail.address.postcode},{' '}
                        {downloadReport.data.collectionDetail.address.country}
                      </Value>
                    </DataRow>
                    <DataRow>
                      <Label>Contact person</Label>
                      <Value>
                        {
                          downloadReport.data.collectionDetail.contactDetails
                            .fullName
                        }
                      </Value>
                    </DataRow>
                    <DataRow>
                      <GridRow>
                        <div>
                          <Label>Tel</Label>
                          <Value>
                            {
                              downloadReport.data.collectionDetail
                                .contactDetails.phoneNumber
                            }
                          </Value>
                        </div>
                        <div>
                          <Label>Fax</Label>
                          <Value>
                            {
                              downloadReport.data.collectionDetail
                                .contactDetails.faxNumber
                            }
                          </Value>
                        </div>
                      </GridRow>
                    </DataRow>

                    <DataRow>
                      <Label>Email</Label>
                      <Value>
                        {
                          downloadReport.data.collectionDetail.contactDetails
                            .emailAddress
                        }
                      </Value>
                    </DataRow>
                  </>
                )}
              </Box>
              <Box id="pdf-box-8">
                <SectionTitle id="pdf-box-8-title">
                  8. Recovery operation (or if appropriate disposal operation in
                  the case of waste referred to in Article 3(4)):
                </SectionTitle>
                <DataRow>
                  <Value>
                    {downloadReport.data.recoveryFacilityDetail.status ===
                      'Complete' && (
                      <>
                        {downloadReport.data.recoveryFacilityDetail.values[0]
                          .recoveryFacilityType.type === 'Laboratory' && (
                          <span>
                            Disposal Code:{' '}
                            {
                              downloadReport.data.recoveryFacilityDetail.values[0].recoveryFacilityType.disposalCode.split(
                                ':'
                              )[0]
                            }
                          </span>
                        )}
                        {downloadReport.data.recoveryFacilityDetail.values[0]
                          .recoveryFacilityType.type === 'InterimSite' && (
                          <span>
                            Recovery Code:{' '}
                            {
                              downloadReport.data.recoveryFacilityDetail.values[0].recoveryFacilityType.recoveryCode.split(
                                ':'
                              )[0]
                            }
                            (Interim-site)
                          </span>
                        )}
                        {downloadReport.data.recoveryFacilityDetail.values[0]
                          .recoveryFacilityType.type === 'RecoveryFacility' && (
                          <span>
                            Recovery Code:{' '}
                            {
                              downloadReport.data.recoveryFacilityDetail.values[0].recoveryFacilityType.recoveryCode.split(
                                ':'
                              )[0]
                            }
                          </span>
                        )}
                        {downloadReport.data.recoveryFacilityDetail.values
                          .length > 1 &&
                          downloadReport.data.recoveryFacilityDetail.values[1]
                            .recoveryFacilityType.type !== 'Laboratory' && (
                            <span>
                              ,{' '}
                              {
                                downloadReport.data.recoveryFacilityDetail.values[1].recoveryFacilityType.recoveryCode.split(
                                  ':'
                                )[0]
                              }
                            </span>
                          )}
                        {downloadReport.data.recoveryFacilityDetail.values
                          .length > 2 &&
                          downloadReport.data.recoveryFacilityDetail.values[2]
                            .recoveryFacilityType.type !== 'Laboratory' && (
                            <span>
                              ,{' '}
                              {
                                downloadReport.data.recoveryFacilityDetail.values[2].recoveryFacilityType.recoveryCode.split(
                                  ':'
                                )[0]
                              }
                            </span>
                          )}
                      </>
                    )}
                  </Value>
                </DataRow>
                <Line></Line>
                <div id="pdf-box-9">
                  <SectionTitle id="pdf-box-9-title">
                    9. Usual description of the waste:
                  </SectionTitle>
                  <DataRow>
                    <Value>
                      {downloadReport.data.wasteDescription.status ===
                        'Complete' && (
                        <span>
                          {downloadReport.data.wasteDescription.description}
                        </span>
                      )}
                    </Value>
                  </DataRow>
                </div>
              </Box>
            </Row>
            <Row>
              <Box id="pdf-box-7">
                <SectionTitle id="pdf-box-7-title">
                  {downloadReport.data.wasteDescription.status ===
                    'Complete' && (
                    <>
                      {downloadReport.data.wasteDescription.wasteCode.type ===
                        'NotApplicable' && <span>7. Laboratory</span>}
                      {downloadReport.data.wasteDescription.wasteCode.type !==
                        'NotApplicable' && <span>7. Recovery facility</span>}
                    </>
                  )}
                </SectionTitle>
                {downloadReport.data.recoveryFacilityDetail.status ===
                  'Complete' && (
                  <>
                    <DataRow>
                      <Label>Name</Label>
                      <Value>
                        {downloadReport.data.recoveryFacilityDetail.values[0]
                          .recoveryFacilityType.type !== 'InterimSite' ? (
                          <span>
                            {
                              downloadReport.data.recoveryFacilityDetail
                                .values[0].addressDetails.name
                            }
                          </span>
                        ) : (
                          <span>
                            {
                              downloadReport.data.recoveryFacilityDetail
                                .values[1].addressDetails.name
                            }
                          </span>
                        )}
                      </Value>
                    </DataRow>
                    <DataRow>
                      <Label>Address</Label>
                      <Value>
                        {downloadReport.data.recoveryFacilityDetail.values[0]
                          .recoveryFacilityType.type !== 'InterimSite' ? (
                          <span>
                            {
                              downloadReport.data.recoveryFacilityDetail
                                .values[0].addressDetails.address
                            }
                            ,&nbsp;
                            {
                              downloadReport.data.recoveryFacilityDetail
                                .values[0].addressDetails.country
                            }
                          </span>
                        ) : (
                          <span>
                            {
                              downloadReport.data.recoveryFacilityDetail
                                .values[1].addressDetails.address
                            }
                            ,&nbsp;
                            {
                              downloadReport.data.recoveryFacilityDetail
                                .values[1].addressDetails.country
                            }
                          </span>
                        )}
                      </Value>
                    </DataRow>
                    <DataRow>
                      <Label>Contact person</Label>
                      <Value>
                        {downloadReport.data.recoveryFacilityDetail.values[0]
                          .recoveryFacilityType.type !== 'InterimSite' ? (
                          <span>
                            {
                              downloadReport.data.recoveryFacilityDetail
                                .values[0].contactDetails.fullName
                            }
                          </span>
                        ) : (
                          <span>
                            {
                              downloadReport.data.recoveryFacilityDetail
                                .values[1].contactDetails.fullName
                            }
                          </span>
                        )}
                      </Value>
                    </DataRow>
                    <DataRow>
                      <GridRow>
                        <div>
                          <Label>Tel.</Label>
                          <Value>
                            {downloadReport.data.recoveryFacilityDetail
                              .values[0].recoveryFacilityType.type !==
                            'InterimSite' ? (
                              <span>
                                {
                                  downloadReport.data.recoveryFacilityDetail
                                    .values[0].contactDetails.phoneNumber
                                }
                              </span>
                            ) : (
                              <span>
                                {
                                  downloadReport.data.recoveryFacilityDetail
                                    .values[1].contactDetails.phoneNumber
                                }
                              </span>
                            )}
                          </Value>
                        </div>
                        <div>
                          <Label>Fax</Label>
                          <Value>
                            {downloadReport.data.recoveryFacilityDetail
                              .values[0].recoveryFacilityType.type !==
                            'InterimSite' ? (
                              <span>
                                {
                                  downloadReport.data.recoveryFacilityDetail
                                    .values[0].contactDetails.faxNumber
                                }
                              </span>
                            ) : (
                              <span>
                                {
                                  downloadReport.data.recoveryFacilityDetail
                                    .values[1].contactDetails.faxNumber
                                }
                              </span>
                            )}
                          </Value>
                        </div>
                      </GridRow>
                    </DataRow>
                    <DataRow>
                      <Label>Email</Label>
                      <Value>
                        {downloadReport.data.recoveryFacilityDetail.values[0]
                          .recoveryFacilityType.type !== 'InterimSite' ? (
                          <span>
                            {
                              downloadReport.data.recoveryFacilityDetail
                                .values[0].contactDetails.emailAddress
                            }
                          </span>
                        ) : (
                          <span>
                            {
                              downloadReport.data.recoveryFacilityDetail
                                .values[1].contactDetails.emailAddress
                            }
                          </span>
                        )}
                      </Value>
                    </DataRow>
                  </>
                )}
              </Box>

              <Box id="pdf-box-10">
                {downloadReport.data.wasteDescription.status === 'Complete' && (
                  <>
                    <SectionTitle id="pdf-box-10-title">
                      10. Waste identification:
                    </SectionTitle>
                    <DataRow>
                      {downloadReport.data.wasteDescription.wasteCode.type ===
                      'NotApplicable' ? (
                        <>
                          <Label>Waste code</Label>
                          <Value>
                            {
                              downloadReport.data.wasteDescription.wasteCode
                                .type
                            }
                          </Value>
                        </>
                      ) : (
                        <>
                          <Label>
                            {
                              downloadReport.data.wasteDescription.wasteCode
                                .type
                            }
                          </Label>
                          <Value>
                            {
                              downloadReport.data.wasteDescription.wasteCode.value.split(
                                ':'
                              )[0]
                            }
                          </Value>
                        </>
                      )}
                    </DataRow>
                    <DataRow>
                      <Label>EC list of wastes</Label>
                      <Value>
                        <CommaList>
                          {downloadReport.data.wasteDescription.ewcCodes
                            .slice(0, 3)
                            .map((item, index) => (
                              <span key={index}>{item.split(':')[0]}</span>
                            ))}
                        </CommaList>
                      </Value>
                    </DataRow>
                  </>
                )}

                <DataRow>
                  <Label>National code</Label>
                  <Value>
                    {downloadReport.data.wasteDescription.status ===
                      'Complete' &&
                      downloadReport.data.wasteDescription.nationalCode
                        .provided === 'Yes' &&
                      downloadReport.data.wasteDescription.nationalCode.value}
                  </Value>
                </DataRow>
              </Box>
            </Row>
            <Row>
              <Box id="pdf-box-11">
                <SectionTitle id="pdf-box-11-title">
                  11. Countries/states concerned:
                </SectionTitle>
                <Table>
                  {downloadReport.data.transitCountries.status ===
                    'Complete' && (
                    <>
                      <tr>
                        <th>Export/dispatch</th>
                        <th
                          colSpan={
                            downloadReport.data.transitCountries.values.length >
                            3
                              ? 3
                              : downloadReport.data.transitCountries.values
                                  .length
                          }
                        >
                          Transit
                        </th>
                        <th>Import/destination</th>
                      </tr>
                      <tr>
                        <td>
                          {downloadReport.data.exporterDetail.status ===
                            'Complete' &&
                            downloadReport.data.exporterDetail.exporterAddress
                              .country}
                        </td>
                        <td>
                          {downloadReport.data.transitCountries.values.length >
                            0 && downloadReport.data.transitCountries.values[0]}
                        </td>
                        {downloadReport.data.transitCountries.values.length >
                          1 && (
                          <td>
                            {downloadReport.data.transitCountries.values[1]}
                          </td>
                        )}
                        {downloadReport.data.transitCountries.values.length >
                          2 && (
                          <td>
                            {downloadReport.data.transitCountries.values[2]}
                          </td>
                        )}
                        <td>
                          {downloadReport.data.importerDetail.status ===
                            'Complete' &&
                            downloadReport.data.importerDetail
                              .importerAddressDetails.country}
                        </td>
                      </tr>
                    </>
                  )}
                </Table>
              </Box>
            </Row>
            <Row>
              <Box id="pdf-box-12">
                <InlineSectionTitle id="pdf-box-12-title">
                  12. Declaration of the person who arranges the shipment:&nbsp;
                </InlineSectionTitle>
                <span>
                  I certify that the above information is complete and correct
                  to my best knowledge. I also certify that effective written
                  contractual obligations have been entered into with the
                  consignee (not required in the case of waste referred to in
                  Article 3(4)):
                </span>
                <DataRow>
                  <br />
                  <SignName>Name</SignName>
                  <SignDate>Date</SignDate>
                  <SignSignature>Signature</SignSignature>
                </DataRow>
              </Box>
            </Row>
            <Row>
              <Box id="pdf-box-13">
                <SectionTitle id="pdf-box-13-title">
                  13. Signature upon receipt of the waste by the consignee:
                </SectionTitle>
                <DataRow>
                  <br />
                  <SignName>Name</SignName>
                  <SignDate>Date</SignDate>
                  <SignSignature>Signature</SignSignature>
                </DataRow>
              </Box>
            </Row>
            <Row>
              <Box>
                {downloadReport.data.wasteDescription.status === 'Complete' &&
                downloadReport.data.wasteDescription.wasteCode.type ===
                  'NotApplicable' ? (
                  <Warning>To be completed by the Laboratory</Warning>
                ) : (
                  <Warning>To be completed by the Recovery facility</Warning>
                )}
              </Box>
            </Row>
            <Row>
              <Box id="pdf-box-14">
                {downloadReport.data.wasteDescription.status === 'Complete' &&
                downloadReport.data.wasteDescription.wasteCode.type ===
                  'NotApplicable' ? (
                  <InlineSectionTitle id="pdf-box-14-title">
                    14. Shipment received at laboratory &nbsp;
                  </InlineSectionTitle>
                ) : (
                  <InlineSectionTitle id="pdf-box-14-title">
                    14. Shipment received at recovery facility &nbsp;
                  </InlineSectionTitle>
                )}
                <span>Quantity received: &nbsp;</span>
                <Value>
                  {downloadReport.data.wasteDescription.status ===
                    'Complete' && (
                    <>
                      <Value>
                        {downloadReport.data.wasteQuantity.status ===
                          'Complete' &&
                        downloadReport.data.wasteQuantity.value.type ===
                          'ActualData' ? (
                          <>
                            <UnitDisplay
                              quantityType={
                                downloadReport.data.wasteQuantity.value
                                  .actualData.quantityType
                              }
                              type={
                                downloadReport.data.wasteDescription.wasteCode
                                  .type
                              }
                            />
                            <span>: __________</span>
                          </>
                        ) : (
                          <>
                            {downloadReport.data.wasteDescription.wasteCode
                              .type === 'NotApplicable' ? (
                              <span>&nbsp;kg: __________</span>
                            ) : (
                              <span>
                                &nbsp;Tonnes (Mg): __________ m3: __________
                              </span>
                            )}
                          </>
                        )}
                      </Value>
                    </>
                  )}
                </Value>
                <DataRow>
                  <br />
                  <SignName>Name</SignName>
                  <SignDate>Date</SignDate>
                  <SignSignature>Signature</SignSignature>
                </DataRow>
              </Box>
            </Row>
            <Meta>
              <ol>
                <li>
                  Information accompanying shipments of green listed waste and
                  destined for recovery or waste destined for laboratory
                  analysis pursuant to Regulation (EC) No 1013/2006. For
                  completing this document, see also the corresponding specific
                  instructions as contained in Annex IC of Regulation (EC) No
                  1013/2006 on shipments of waste{' '}
                </li>
                <li>
                  If more than 3 carriers, attach information as required in
                  blocks 5 (a, b, c).{' '}
                </li>
                <li>
                  When the person who arranges the shipment is not the producer
                  or collector, information about the producer or collector
                  shall be provided.{' '}
                </li>
                <li>
                  The relevant code(s) as indicated in Annex IIIA to Regulation
                  (EC) No 1013/2006 are to be used, as appropriate in sequence.
                  Certain Basel entries such as B1100, B3010 and B3020 are
                  restricted to particular waste streams only, as indicated in
                  Annex IIIA.{' '}
                </li>
                <li>
                  The BEU codes listed in Annex IIIB to Regulation (EC) No
                  1013/2006 are to be used
                </li>
              </ol>
            </Meta>
            <H2>Additional information for the Annex VII</H2>
            <Row>
              <Box id="pdf-box-5c-4th-carr">
                <SectionTitle id="pdf-box-5c-4th-carr-title">
                  5.(c) 4<sup>th</sup> carrier{' '}
                </SectionTitle>
                {downloadReport.data.carriers.status === 'Complete' && (
                  <>
                    <DataRow>
                      <Label>Name</Label>
                      <Value>
                        {downloadReport.data.carriers.values.length > 3 &&
                          downloadReport.data.carriers.values[3].addressDetails
                            .organisationName}
                      </Value>
                    </DataRow>
                    <DataRow>
                      <Label>Address</Label>
                      <Value>
                        {downloadReport.data.carriers.values.length > 3 &&
                          downloadReport.data.carriers.values[3].addressDetails
                            .address}
                      </Value>
                    </DataRow>
                    <DataRow>
                      <Label>Contact person</Label>
                      <Value>
                        {downloadReport.data.carriers.values.length > 3 &&
                          downloadReport.data.carriers.values[3].contactDetails
                            .fullName}
                      </Value>
                    </DataRow>
                    <DataRow>
                      <Label>Tel</Label>
                      <Value>
                        {downloadReport.data.carriers.values.length > 3 &&
                          downloadReport.data.carriers.values[3].contactDetails
                            .phoneNumber}
                      </Value>
                    </DataRow>
                    <DataRow>
                      <Label>Fax</Label>
                      <Value>
                        {downloadReport.data.carriers.values.length > 3 &&
                          downloadReport.data.carriers.values[3].contactDetails
                            .faxNumber}
                      </Value>
                    </DataRow>
                    <DataRow>
                      <Label>Email</Label>
                      <Value>
                        {downloadReport.data.carriers.values.length > 3 &&
                          downloadReport.data.carriers.values[3].contactDetails
                            .emailAddress}
                      </Value>
                    </DataRow>
                    <DataRow>
                      <Label>Means of transport</Label>
                      {downloadReport.data.wasteDescription.status ===
                        'Complete' &&
                        downloadReport.data.wasteDescription.wasteCode.type !==
                          'NotApplicable' && (
                          <Value>
                            {downloadReport.data.carriers.values.length > 3 &&
                              downloadReport.data.carriers.values[3]
                                .transportDetails.type}
                          </Value>
                        )}
                    </DataRow>
                    <DataRow>
                      <Label>Date of transport</Label>
                      <Value></Value>
                    </DataRow>
                    <DataRow>
                      <Label>Signature</Label>
                      <Value></Value>
                    </DataRow>
                  </>
                )}
              </Box>
              <Box id="pdf-box-5c-5th-carr">
                <SectionTitle id="pdf-box-5c-5th-carr-title">
                  5.(c) 5<sup>th</sup> carrier{' '}
                </SectionTitle>
                {downloadReport.data.carriers.status === 'Complete' && (
                  <>
                    <DataRow>
                      <Label>Name</Label>
                      <Value>
                        {downloadReport.data.carriers.values.length > 4 &&
                          downloadReport.data.carriers.values[4].addressDetails
                            .organisationName}
                      </Value>
                    </DataRow>
                    <DataRow>
                      <Label>Address</Label>
                      <Value>
                        {downloadReport.data.carriers.values.length > 4 &&
                          downloadReport.data.carriers.values[4].addressDetails
                            .address}
                      </Value>
                    </DataRow>
                    <DataRow>
                      <Label>Contact person</Label>
                      <Value>
                        {downloadReport.data.carriers.values.length > 4 &&
                          downloadReport.data.carriers.values[4].contactDetails
                            .fullName}
                      </Value>
                    </DataRow>
                    <DataRow>
                      <Label>Tel</Label>
                      <Value>
                        {downloadReport.data.carriers.values.length > 4 &&
                          downloadReport.data.carriers.values[4].contactDetails
                            .phoneNumber}
                      </Value>
                    </DataRow>
                    <DataRow>
                      <Label>Fax</Label>
                      <Value>
                        {downloadReport.data.carriers.values.length > 4 &&
                          downloadReport.data.carriers.values[4].contactDetails
                            .faxNumber}
                      </Value>
                    </DataRow>
                    <DataRow>
                      <Label>Email</Label>
                      <Value>
                        {downloadReport.data.carriers.values.length > 4 &&
                          downloadReport.data.carriers.values[4].contactDetails
                            .emailAddress}
                      </Value>
                    </DataRow>
                    <DataRow>
                      <Label>Means of transport</Label>
                      {downloadReport.data.wasteDescription.status ===
                        'Complete' &&
                        downloadReport.data.wasteDescription.wasteCode.type !==
                          'NotApplicable' && (
                          <Value>
                            {downloadReport.data.carriers.values.length > 4 &&
                              downloadReport.data.carriers.values[4]
                                .transportDetails.type}
                          </Value>
                        )}
                    </DataRow>
                    <DataRow>
                      <Label>Date of transport</Label>
                      <Value></Value>
                    </DataRow>
                    <DataRow>
                      <Label>Signature</Label>
                      <Value></Value>
                    </DataRow>
                  </>
                )}
              </Box>
            </Row>
            <Row>
              <Box id="pdf-box-5c-cont">
                <SectionTitle id="pdf-box-5c-cont-title">
                  5 cont. Means of transport details (if provided)
                </SectionTitle>
              </Box>
              <Box>
                <SectionTitle>
                  5.(a) 1<sup>st</sup> carrier <sup>(2)</sup>
                </SectionTitle>
              </Box>
              <Box>
                <SectionTitle>
                  5.(b) 2<sup>nd</sup> carrier
                </SectionTitle>
              </Box>
              <Box>
                <SectionTitle>
                  5.(c) 3<sup>rd</sup> carrier
                </SectionTitle>
              </Box>
              <Box>
                <SectionTitle>
                  5.(d) 4<sup>th</sup> carrier
                </SectionTitle>
              </Box>
              <Box>
                <SectionTitle>
                  5.(e) 5<sup>th</sup> carrier
                </SectionTitle>
              </Box>
            </Row>
            <Row>
              <Box>Vehicle registration</Box>
              {downloadReport.data.carriers.status === 'Complete' &&
                downloadReport.data.wasteDescription.status == 'Complete' && (
                  <>
                    <Box>
                      {downloadReport.data.wasteDescription.wasteCode.type !==
                        'NotApplicable' &&
                        downloadReport.data.carriers.values[0].transportDetails
                          .type !== 'BulkVessel' && (
                          <Value>
                            {
                              downloadReport.data.carriers.values[0]
                                .transportDetails.vehicleRegistration
                            }
                          </Value>
                        )}
                    </Box>
                    <Box>
                      {downloadReport.data.wasteDescription.wasteCode.type !==
                        'NotApplicable' &&
                        downloadReport.data.carriers.values.length > 1 &&
                        downloadReport.data.carriers.values[1].transportDetails
                          .type !== 'BulkVessel' && (
                          <Value>
                            {
                              downloadReport.data.carriers.values[1]
                                .transportDetails.vehicleRegistration
                            }
                          </Value>
                        )}
                    </Box>
                    <Box>
                      {downloadReport.data.wasteDescription.wasteCode.type !==
                        'NotApplicable' &&
                        downloadReport.data.carriers.values.length > 2 &&
                        downloadReport.data.carriers.values[2].transportDetails
                          .type !== 'BulkVessel' && (
                          <Value>
                            {
                              downloadReport.data.carriers.values[2]
                                .transportDetails.vehicleRegistration
                            }
                          </Value>
                        )}
                    </Box>
                    <Box>
                      {downloadReport.data.wasteDescription.wasteCode.type !==
                        'NotApplicable' &&
                        downloadReport.data.carriers.values.length > 3 &&
                        downloadReport.data.carriers.values[3].transportDetails
                          .type !== 'BulkVessel' && (
                          <Value>
                            {
                              downloadReport.data.carriers.values[3]
                                .transportDetails.vehicleRegistration
                            }
                          </Value>
                        )}
                    </Box>
                    <Box>
                      {downloadReport.data.wasteDescription.wasteCode.type !==
                        'NotApplicable' &&
                        downloadReport.data.carriers.values.length > 4 &&
                        downloadReport.data.carriers.values[4].transportDetails
                          .type !== 'BulkVessel' && (
                          <Value>
                            {
                              downloadReport.data.carriers.values[4]
                                .transportDetails.vehicleRegistration
                            }
                          </Value>
                        )}
                    </Box>
                  </>
                )}
            </Row>
            <Row>
              <Box>Trailer / shipping container number</Box>
              {downloadReport.data.carriers.status === 'Complete' &&
                downloadReport.data.wasteDescription.status == 'Complete' && (
                  <>
                    <Box>
                      {downloadReport.data.wasteDescription.wasteCode.type !==
                        'NotApplicable' &&
                        downloadReport.data.carriers.values[0].transportDetails
                          .type === 'Trailer' && (
                          <Value>
                            {
                              downloadReport.data.carriers.values[0]
                                .transportDetails.trailerNumber
                            }
                          </Value>
                        )}
                      {downloadReport.data.wasteDescription.wasteCode.type !==
                        'NotApplicable' &&
                        downloadReport.data.carriers.values[0].transportDetails
                          .type === 'ShippingContainer' && (
                          <Value>
                            {
                              downloadReport.data.carriers.values[0]
                                .transportDetails.shippingContainerNumber
                            }
                          </Value>
                        )}
                    </Box>
                    <Box>
                      {downloadReport.data.wasteDescription.wasteCode.type !==
                        'NotApplicable' &&
                        downloadReport.data.carriers.values.length > 1 &&
                        downloadReport.data.carriers.values[1].transportDetails
                          .type === 'Trailer' && (
                          <Value>
                            {
                              downloadReport.data.carriers.values[1]
                                .transportDetails.trailerNumber
                            }
                          </Value>
                        )}
                      {downloadReport.data.wasteDescription.wasteCode.type !==
                        'NotApplicable' &&
                        downloadReport.data.carriers.values.length > 1 &&
                        downloadReport.data.carriers.values[1].transportDetails
                          .type === 'ShippingContainer' && (
                          <Value>
                            {
                              downloadReport.data.carriers.values[1]
                                .transportDetails.shippingContainerNumber
                            }
                          </Value>
                        )}
                    </Box>
                    <Box>
                      {downloadReport.data.wasteDescription.wasteCode.type !==
                        'NotApplicable' &&
                        downloadReport.data.carriers.values.length > 2 &&
                        downloadReport.data.carriers.values[2].transportDetails
                          .type === 'Trailer' && (
                          <Value>
                            {
                              downloadReport.data.carriers.values[2]
                                .transportDetails.trailerNumber
                            }
                          </Value>
                        )}
                      {downloadReport.data.wasteDescription.wasteCode.type !==
                        'NotApplicable' &&
                        downloadReport.data.carriers.values.length > 2 &&
                        downloadReport.data.carriers.values[2].transportDetails
                          .type === 'ShippingContainer' && (
                          <Value>
                            {
                              downloadReport.data.carriers.values[2]
                                .transportDetails.shippingContainerNumber
                            }
                          </Value>
                        )}
                    </Box>
                    <Box>
                      {downloadReport.data.wasteDescription.wasteCode.type !==
                        'NotApplicable' &&
                        downloadReport.data.carriers.values.length > 3 &&
                        downloadReport.data.carriers.values[3].transportDetails
                          .type === 'Trailer' && (
                          <Value>
                            {
                              downloadReport.data.carriers.values[3]
                                .transportDetails.trailerNumber
                            }
                          </Value>
                        )}
                      {downloadReport.data.wasteDescription.wasteCode.type !==
                        'NotApplicable' &&
                        downloadReport.data.carriers.values.length > 3 &&
                        downloadReport.data.carriers.values[3].transportDetails
                          .type === 'ShippingContainer' && (
                          <Value>
                            {
                              downloadReport.data.carriers.values[3]
                                .transportDetails.shippingContainerNumber
                            }
                          </Value>
                        )}
                    </Box>
                    <Box>
                      {downloadReport.data.wasteDescription.wasteCode.type !==
                        'NotApplicable' &&
                        downloadReport.data.carriers.values.length > 4 &&
                        downloadReport.data.carriers.values[4].transportDetails
                          .type === 'Trailer' && (
                          <Value>
                            {
                              downloadReport.data.carriers.values[4]
                                .transportDetails.trailerNumber
                            }
                          </Value>
                        )}
                      {downloadReport.data.wasteDescription.wasteCode.type !==
                        'NotApplicable' &&
                        downloadReport.data.carriers.values.length > 4 &&
                        downloadReport.data.carriers.values[4].transportDetails
                          .type === 'ShippingContainer' && (
                          <Value>
                            {
                              downloadReport.data.carriers.values[4]
                                .transportDetails.shippingContainerNumber
                            }
                          </Value>
                        )}
                    </Box>
                  </>
                )}
            </Row>
            <Row>
              <Box>Bulk vessel IMO number</Box>
              {downloadReport.data.carriers.status === 'Complete' &&
                downloadReport.data.wasteDescription.status == 'Complete' && (
                  <>
                    <Box>
                      {downloadReport.data.wasteDescription.wasteCode.type !==
                        'NotApplicable' &&
                        downloadReport.data.carriers.values[0].transportDetails
                          .type === 'BulkVessel' && (
                          <Value>
                            {
                              downloadReport.data.carriers.values[0]
                                .transportDetails.imo
                            }
                          </Value>
                        )}
                    </Box>
                    <Box>
                      {downloadReport.data.wasteDescription.wasteCode.type !==
                        'NotApplicable' &&
                        downloadReport.data.carriers.values.length > 1 &&
                        downloadReport.data.carriers.values[1].transportDetails
                          .type === 'BulkVessel' && (
                          <Value>
                            {
                              downloadReport.data.carriers.values[1]
                                .transportDetails.imo
                            }
                          </Value>
                        )}
                    </Box>
                    <Box>
                      {downloadReport.data.wasteDescription.wasteCode.type !==
                        'NotApplicable' &&
                        downloadReport.data.carriers.values.length > 2 &&
                        downloadReport.data.carriers.values[2].transportDetails
                          .type === 'BulkVessel' && (
                          <Value>
                            {
                              downloadReport.data.carriers.values[2]
                                .transportDetails.imo
                            }
                          </Value>
                        )}
                    </Box>
                    <Box>
                      {downloadReport.data.wasteDescription.wasteCode.type !==
                        'NotApplicable' &&
                        downloadReport.data.carriers.values.length > 3 &&
                        downloadReport.data.carriers.values[3].transportDetails
                          .type === 'BulkVessel' && (
                          <Value>
                            {
                              downloadReport.data.carriers.values[3]
                                .transportDetails.imo
                            }
                          </Value>
                        )}
                    </Box>
                    <Box>
                      {downloadReport.data.wasteDescription.wasteCode.type !==
                        'NotApplicable' &&
                        downloadReport.data.carriers.values.length > 4 &&
                        downloadReport.data.carriers.values[4].transportDetails
                          .type === 'BulkVessel' && (
                          <Value>
                            {
                              downloadReport.data.carriers.values[4]
                                .transportDetails.imo
                            }
                          </Value>
                        )}
                    </Box>
                  </>
                )}
            </Row>
            <Row>
              <Box id="pdf-box-7-cont">
                <SectionTitle id="pdf-box-7-cont-title">
                  7. Second recovery site details:
                </SectionTitle>
                {downloadReport.data.recoveryFacilityDetail.status ===
                  'Complete' && (
                  <>
                    <DataRow>
                      <Label>Name</Label>
                      <Value>
                        {downloadReport.data.recoveryFacilityDetail.values[0]
                          .recoveryFacilityType.type === 'InterimSite' &&
                          downloadReport.data.recoveryFacilityDetail.values
                            .length === 3 && (
                            <span>
                              {
                                downloadReport.data.recoveryFacilityDetail
                                  .values[2].addressDetails.name
                              }
                            </span>
                          )}
                        {downloadReport.data.recoveryFacilityDetail.values[0]
                          .recoveryFacilityType.type !== 'InterimSite' &&
                          downloadReport.data.recoveryFacilityDetail.values
                            .length === 2 && (
                            <span>
                              {
                                downloadReport.data.recoveryFacilityDetail
                                  .values[1].addressDetails.name
                              }
                            </span>
                          )}
                      </Value>
                    </DataRow>
                    <DataRow>
                      <Label>Address</Label>
                      <Value>
                        {downloadReport.data.recoveryFacilityDetail.values[0]
                          .recoveryFacilityType.type === 'InterimSite' &&
                          downloadReport.data.recoveryFacilityDetail.values
                            .length === 3 && (
                            <span>
                              {
                                downloadReport.data.recoveryFacilityDetail
                                  .values[2].addressDetails.address
                              }
                              ,&nbsp;
                              {
                                downloadReport.data.recoveryFacilityDetail
                                  .values[2].addressDetails.country
                              }
                            </span>
                          )}
                        {downloadReport.data.recoveryFacilityDetail.values[0]
                          .recoveryFacilityType.type !== 'InterimSite' &&
                          downloadReport.data.recoveryFacilityDetail.values
                            .length === 2 && (
                            <span>
                              {
                                downloadReport.data.recoveryFacilityDetail
                                  .values[1].addressDetails.address
                              }
                              ,&nbsp;
                              {
                                downloadReport.data.recoveryFacilityDetail
                                  .values[1].addressDetails.country
                              }
                            </span>
                          )}
                      </Value>
                    </DataRow>
                    <DataRow>
                      <Label>Contact person</Label>
                      <Value>
                        {downloadReport.data.recoveryFacilityDetail.values[0]
                          .recoveryFacilityType.type === 'InterimSite' &&
                          downloadReport.data.recoveryFacilityDetail.values
                            .length === 3 && (
                            <span>
                              {
                                downloadReport.data.recoveryFacilityDetail
                                  .values[2].contactDetails.fullName
                              }
                            </span>
                          )}
                        {downloadReport.data.recoveryFacilityDetail.values[0]
                          .recoveryFacilityType.type !== 'InterimSite' &&
                          downloadReport.data.recoveryFacilityDetail.values
                            .length === 2 && (
                            <span>
                              {
                                downloadReport.data.recoveryFacilityDetail
                                  .values[1].contactDetails.fullName
                              }
                            </span>
                          )}
                      </Value>
                    </DataRow>
                    <DataRow>
                      <Label>Tel.</Label>
                      <Value>
                        {downloadReport.data.recoveryFacilityDetail.values[0]
                          .recoveryFacilityType.type === 'InterimSite' &&
                          downloadReport.data.recoveryFacilityDetail.values
                            .length === 3 && (
                            <span>
                              {
                                downloadReport.data.recoveryFacilityDetail
                                  .values[2].contactDetails.phoneNumber
                              }
                            </span>
                          )}
                        {downloadReport.data.recoveryFacilityDetail.values[0]
                          .recoveryFacilityType.type !== 'InterimSite' &&
                          downloadReport.data.recoveryFacilityDetail.values
                            .length === 2 && (
                            <span>
                              {
                                downloadReport.data.recoveryFacilityDetail
                                  .values[1].contactDetails.phoneNumber
                              }
                            </span>
                          )}
                      </Value>
                    </DataRow>
                    <DataRow>
                      <Label>Fax</Label>
                      <Value>
                        {downloadReport.data.recoveryFacilityDetail.values[0]
                          .recoveryFacilityType.type === 'InterimSite' &&
                          downloadReport.data.recoveryFacilityDetail.values
                            .length === 3 && (
                            <span>
                              {
                                downloadReport.data.recoveryFacilityDetail
                                  .values[2].contactDetails.faxNumber
                              }
                            </span>
                          )}
                        {downloadReport.data.recoveryFacilityDetail.values[0]
                          .recoveryFacilityType.type !== 'InterimSite' &&
                          downloadReport.data.recoveryFacilityDetail.values
                            .length === 2 && (
                            <span>
                              {
                                downloadReport.data.recoveryFacilityDetail
                                  .values[1].contactDetails.faxNumber
                              }
                            </span>
                          )}
                      </Value>
                    </DataRow>
                    <DataRow>
                      <Label>Email</Label>
                      <Value>
                        {downloadReport.data.recoveryFacilityDetail.values[0]
                          .recoveryFacilityType.type === 'InterimSite' &&
                          downloadReport.data.recoveryFacilityDetail.values
                            .length === 3 && (
                            <span>
                              {
                                downloadReport.data.recoveryFacilityDetail
                                  .values[2].contactDetails.emailAddress
                              }
                            </span>
                          )}
                        {downloadReport.data.recoveryFacilityDetail.values[0]
                          .recoveryFacilityType.type !== 'InterimSite' &&
                          downloadReport.data.recoveryFacilityDetail.values
                            .length === 2 && (
                            <span>
                              {
                                downloadReport.data.recoveryFacilityDetail
                                  .values[1].contactDetails.emailAddress
                              }
                            </span>
                          )}
                      </Value>
                    </DataRow>
                  </>
                )}
              </Box>
              <Box>
                <SectionTitle>Interim site:</SectionTitle>
                {downloadReport.data.recoveryFacilityDetail.status ===
                  'Complete' && (
                  <>
                    <DataRow>
                      <Label>Name</Label>
                      <Value>
                        {downloadReport.data.recoveryFacilityDetail.values[0]
                          .recoveryFacilityType.type === 'InterimSite' && (
                          <span>
                            {
                              downloadReport.data.recoveryFacilityDetail
                                .values[0].addressDetails.name
                            }
                          </span>
                        )}
                      </Value>
                    </DataRow>
                    <DataRow>
                      <Label>Address</Label>
                      <Value>
                        {downloadReport.data.recoveryFacilityDetail.values[0]
                          .recoveryFacilityType.type === 'InterimSite' && (
                          <span>
                            {
                              downloadReport.data.recoveryFacilityDetail
                                .values[0].addressDetails.address
                            }
                            ,&nbsp;
                            {
                              downloadReport.data.recoveryFacilityDetail
                                .values[0].addressDetails.country
                            }
                          </span>
                        )}
                      </Value>
                    </DataRow>
                    <DataRow>
                      <Label>Contact person</Label>
                      <Value>
                        {downloadReport.data.recoveryFacilityDetail.values[0]
                          .recoveryFacilityType.type === 'InterimSite' && (
                          <span>
                            {
                              downloadReport.data.recoveryFacilityDetail
                                .values[0].contactDetails.fullName
                            }
                          </span>
                        )}
                      </Value>
                    </DataRow>
                    <DataRow>
                      <Label>Tel</Label>
                      <Value>
                        {downloadReport.data.recoveryFacilityDetail.values[0]
                          .recoveryFacilityType.type === 'InterimSite' && (
                          <span>
                            {
                              downloadReport.data.recoveryFacilityDetail
                                .values[0].contactDetails.phoneNumber
                            }
                          </span>
                        )}
                      </Value>
                    </DataRow>
                    <DataRow>
                      <Label>Fax</Label>
                      <Value>
                        {downloadReport.data.recoveryFacilityDetail.values[0]
                          .recoveryFacilityType.type === 'InterimSite' && (
                          <span>
                            {
                              downloadReport.data.recoveryFacilityDetail
                                .values[0].contactDetails.faxNumber
                            }
                          </span>
                        )}
                      </Value>
                    </DataRow>
                    <DataRow>
                      <Label>Email</Label>
                      <Value>
                        {downloadReport.data.recoveryFacilityDetail.values[0]
                          .recoveryFacilityType.type === 'InterimSite' && (
                          <span>
                            {
                              downloadReport.data.recoveryFacilityDetail
                                .values[0].contactDetails.emailAddress
                            }
                          </span>
                        )}
                      </Value>
                    </DataRow>
                  </>
                )}
              </Box>
            </Row>
            <Row>
              <Box id="pdf-box-10-cont">
                <InlineSectionTitle id="pdf-box-10-cont-title">
                  10. Additional EWC waste identification codes:{' '}
                </InlineSectionTitle>
                <span>&nbsp;</span>
                {downloadReport.data.wasteDescription.status === 'Complete' && (
                  <CommaList>
                    {downloadReport.data.wasteDescription.ewcCodes
                      .slice(3, 5)
                      .map((item, index) => (
                        <span key={index}>{item.split(':')[0]}</span>
                      ))}
                  </CommaList>
                )}
              </Box>
            </Row>
            <Row>
              <Box id="pdf-box-11-cont">
                <SectionTitle id="pdf-box-11-cont-title">
                  11. Countries/states concerned:{' '}
                </SectionTitle>
                <InlineSectionTitle>
                  4<sup>th</sup>:{' '}
                </InlineSectionTitle>
                <span>
                  &nbsp;
                  {downloadReport.data.transitCountries.status === 'Complete' &&
                    downloadReport.data.transitCountries.values.length > 3 &&
                    downloadReport.data.transitCountries.values[3]}
                </span>
              </Box>
              <Box>
                <InlineSectionTitle>
                  5<sup>th</sup>:{' '}
                </InlineSectionTitle>
                <span>
                  &nbsp;
                  {downloadReport.data.transitCountries.status === 'Complete' &&
                    downloadReport.data.transitCountries.values.length > 4 &&
                    downloadReport.data.transitCountries.values[4]}
                </span>
              </Box>
            </Row>
            <Row>
              <Box id="pdf-box-15-cont">
                <InlineSectionTitle id="pdf-box-15-cont-title">
                  15. Location the waste will leave the UK:{' '}
                </InlineSectionTitle>
                <span>
                  {downloadReport.data.ukExitLocation.status === 'Complete' &&
                    downloadReport.data.ukExitLocation.exitLocation.provided ===
                      'Yes' &&
                    downloadReport.data.ukExitLocation.exitLocation.value}
                </span>
              </Box>
            </Row>
          </Page>
        </>
      )}
    </>
  );
};

DownloadReport.getLayout = function getLayout(page) {
  return <PDFLayout>{page}</PDFLayout>;
};

export default DownloadReport;
