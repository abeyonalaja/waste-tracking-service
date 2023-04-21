import React, { useEffect, useState, useReducer } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import * as GovUK from 'govuk-react';
import '../i18n/config';
import { useTranslation } from 'react-i18next';
import {
  AppLink,
  CompleteFooter,
  CompleteHeader,
  BreadcrumbWrap,
  DocumentStatus,
} from '../components';
import styled from 'styled-components';

import { Submission } from '@wts/api/waste-tracking-gateway';
import {
  H2,
  Heading,
  ListItem,
  OrderedList,
  Paragraph,
  SectionBreak,
  Table,
} from 'govuk-react';

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
  isLoading: false,
  isError: false,
};

const tasklistReducer = (state: State, action: Action) => {
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

const TableCellRight = styled(Table.Cell)`
  text-align: right;
`;

const BoldListItem = styled(ListItem)`
  font-weight: 600;
  font-size: 24px;
`;

const Lower = styled('div')`
  padding-top: 20px;
  padding-bottom: 60px;
`;

const Tasklist = () => {
  const { t } = useTranslation();
  const router = useRouter();

  const [tasklistPage, dispatchTasklistPage] = useReducer(
    tasklistReducer,
    initialWasteDescState
  );

  const [id, setId] = useState(null);

  useEffect(() => {
    if (router.isReady) {
      setId(router.query.id);
    }
  }, [router.isReady, router.query.id]);

  useEffect(() => {
    dispatchTasklistPage({ type: 'DATA_FETCH_INIT' });
    if (id !== null) {
      fetch(`${process.env.NX_API_GATEWAY_URL}/submissions/${id}`)
        .then((response) => {
          if (response.ok) return response.json();
          else {
            dispatchTasklistPage({ type: 'DATA_FETCH_FAILURE' });
          }
        })
        .then((data) => {
          if (data !== undefined) {
            dispatchTasklistPage({
              type: 'DATA_FETCH_SUCCESS',
              payload: data,
            });
          }
        });
    }
  }, [router.isReady, id]);

  const sectionStatus = 0;

  const BreadCrumbs = () => {
    return (
      <BreadcrumbWrap>
        <GovUK.Breadcrumbs>
          <GovUK.Breadcrumbs.Link href="/">
            {t('app.title')}
          </GovUK.Breadcrumbs.Link>
          <GovUK.Breadcrumbs.Link href="/dashboard">
            {t('app.channel.title')}
          </GovUK.Breadcrumbs.Link>
          <GovUK.Breadcrumbs.Link
            href={`../add-your-own-export-reference?id=${id}`}
          >
            {t('yourReference.breadcrumb')}
          </GovUK.Breadcrumbs.Link>
          {t('exportJourney.submitAnExport.breadcrumb')}
        </GovUK.Breadcrumbs>
      </BreadcrumbWrap>
    );
  };

  return (
    <>
      <Head>
        <title>{t('exportJourney.submitAnExport.title')}</title>
      </Head>
      <GovUK.Page
        id="content"
        header={<CompleteHeader />}
        footer={<CompleteFooter />}
        beforeChildren={<BreadCrumbs />}
      >
        <GovUK.GridRow>
          <GovUK.GridCol setWidth="two-thirds">
            {tasklistPage.isError && !tasklistPage.isLoading && (
              <p>No valid record found</p>
            )}
            {tasklistPage.isLoading && <p>Loading</p>}
            {!tasklistPage.isError && !tasklistPage.isLoading && (
              <>
                {tasklistPage.data?.reference ? (
                  <GovUK.Caption id="my-reference">
                    {t('exportJourney.submitAnExport.yourRef')}:{' '}
                    {tasklistPage.data?.reference}
                  </GovUK.Caption>
                ) : (
                  <></>
                )}

                <GovUK.Heading size="LARGE" id="template-heading">
                  {t('exportJourney.submitAnExport.title')}
                </GovUK.Heading>

                <Heading size="SMALL">
                  {sectionStatus < 4
                    ? t('exportJourney.submitAnExport.submissionIncomplete')
                    : t('exportJourney.submitAnExport.submissionComplete')}
                </Heading>

                <Paragraph>
                  {`You have completed ${sectionStatus} of 4 sections.`}
                </Paragraph>

                <OrderedList>
                  <BoldListItem>
                    <H2 size="MEDIUM">
                      {t('exportJourney.submitAnExport.SectionOne.heading')}
                    </H2>
                    <SectionBreak level="SMALL" visible />
                    <Table>
                      <Table.Row>
                        <Table.Cell setWidth="one-half">
                          <AppLink
                            href={{
                              pathname: '/waste-code',
                              query: { id },
                            }}
                          >
                            {t(
                              'exportJourney.submitAnExport.SectionOne.wasteCodesAndDescription'
                            )}
                          </AppLink>
                        </Table.Cell>
                        <TableCellRight setWidth="one-third">
                          <DocumentStatus
                            id="waste-codes-and-description-status"
                            status={tasklistPage.data?.wasteDescription.status}
                          />
                        </TableCellRight>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell setWidth="one-half">
                          <span id="quantity-of-waste">
                            {t(
                              'exportJourney.submitAnExport.SectionOne.quantityOfWaste'
                            )}
                          </span>
                        </Table.Cell>
                        <TableCellRight setWidth="one-third">
                          <DocumentStatus
                            id="quantity-of-waste-status"
                            status={tasklistPage.data?.wasteQuantity.status}
                          />
                        </TableCellRight>
                      </Table.Row>
                    </Table>
                  </BoldListItem>
                  <BoldListItem>
                    <H2 size="MEDIUM">
                      {t('exportJourney.submitAnExport.SectionTwo.heading')}
                    </H2>
                    <SectionBreak level="SMALL" visible />
                    <Table>
                      <Table.Row>
                        <Table.Cell setWidth="one-half">
                          <AppLink
                            href={{
                              pathname: '/exporter-postcode',
                              query: { id },
                            }}
                            id="exporter-details"
                          >
                            {t(
                              'exportJourney.submitAnExport.SectionTwo.exporterDetails'
                            )}
                          </AppLink>
                        </Table.Cell>
                        <TableCellRight setWidth="one-third">
                          <DocumentStatus
                            id="exporter-details-status"
                            status={tasklistPage.data?.exporterDetail.status}
                          />
                        </TableCellRight>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell setWidth="one-half">
                          <AppLink href="" id="importer-details">
                            {t(
                              'exportJourney.submitAnExport.SectionTwo.importerDetails'
                            )}
                          </AppLink>
                        </Table.Cell>
                        <TableCellRight setWidth="one-third">
                          <DocumentStatus
                            id="importer-details-status"
                            status={tasklistPage.data?.importerDetail.status}
                          />
                        </TableCellRight>
                      </Table.Row>
                    </Table>
                  </BoldListItem>
                  <BoldListItem>
                    <H2 size="MEDIUM">
                      {t('exportJourney.submitAnExport.SectionThree.heading')}
                    </H2>
                    <SectionBreak level="SMALL" visible />
                    <Table>
                      <Table.Row>
                        <Table.Cell setWidth="one-half">
                          <AppLink href="" id="collection-details">
                            {t(
                              'exportJourney.submitAnExport.SectionThree.wasteCollectionDetails'
                            )}
                          </AppLink>
                        </Table.Cell>
                        <TableCellRight setWidth="one-third">
                          <DocumentStatus
                            id="collection-details-status"
                            status={tasklistPage.data?.collectionDate.status}
                          />
                        </TableCellRight>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell setWidth="one-half">
                          <AppLink href="" id="waste-carriers">
                            {t(
                              'exportJourney.submitAnExport.SectionThree.wasteCarriers'
                            )}
                          </AppLink>
                        </Table.Cell>
                        <TableCellRight setWidth="one-third">
                          <DocumentStatus
                            id="waste-carriers-status"
                            status={tasklistPage.data?.carriers.status}
                          />
                        </TableCellRight>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell setWidth="one-half">
                          <AppLink href="" id="waste-collection-details">
                            {t(
                              'exportJourney.submitAnExport.SectionThree.wasteCollectionDetails'
                            )}
                          </AppLink>
                        </Table.Cell>
                        <TableCellRight setWidth="one-third">
                          <DocumentStatus
                            id="waste-collection-details-status"
                            status={tasklistPage.data?.collectionDetail.status}
                          />
                        </TableCellRight>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell setWidth="one-half">
                          <AppLink href="" id="location-waste-leaves-the-uk">
                            {t(
                              'exportJourney.submitAnExport.SectionThree.locationWasteLeavesUK'
                            )}
                          </AppLink>
                        </Table.Cell>
                        <TableCellRight setWidth="one-third">
                          <DocumentStatus
                            id="location-waste-leaves-the-uk-status"
                            status={tasklistPage.data?.ukExitLocation.status}
                          />
                        </TableCellRight>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell setWidth="one-half">
                          <AppLink
                            href=""
                            id="countries-waste-will-travel-through"
                          >
                            {t(
                              'exportJourney.submitAnExport.SectionThree.countriesWasteWillTravel'
                            )}
                          </AppLink>
                        </Table.Cell>
                        <TableCellRight setWidth="one-third">
                          <DocumentStatus
                            id="countries-waste-will-travel-through-status"
                            status={tasklistPage.data?.transitCountries.status}
                          />
                        </TableCellRight>
                      </Table.Row>
                    </Table>
                  </BoldListItem>
                  <BoldListItem>
                    <H2 size="MEDIUM">
                      {t('exportJourney.submitAnExport.SectionFour.heading')}
                    </H2>
                    <SectionBreak level="SMALL" visible />
                    <Table>
                      <Table.Row>
                        <Table.Cell setWidth="one-half">
                          {tasklistPage.data?.recoveryFacilityDetail.status ===
                            'CannotStart' &&
                            t(
                              'exportJourney.submitAnExport.SectionFour.recoveryFacilityLaboratory'
                            )}
                          {(tasklistPage.data?.wasteDescription.status ===
                            'Started' ||
                            tasklistPage.data?.wasteDescription.status ===
                              'Complete') && (
                            <AppLink href="">
                              {tasklistPage.data?.wasteDescription?.wasteCode
                                .type === 'NotApplicable'
                                ? t(
                                    'exportJourney.submitAnExport.SectionFour.laboratoryDetails'
                                  )
                                : t(
                                    'exportJourney.submitAnExport.SectionFour.recoveryDetails'
                                  )}
                            </AppLink>
                          )}
                        </Table.Cell>
                        <TableCellRight setWidth="one-third">
                          <DocumentStatus
                            id="recovery-facility-or-laboratory-status"
                            status={
                              tasklistPage.data?.recoveryFacilityDetail.status
                            }
                          />
                        </TableCellRight>
                      </Table.Row>
                    </Table>
                  </BoldListItem>
                </OrderedList>
                <Lower>
                  <H2 size="MEDIUM">
                    {t('exportJourney.submitAnExport.finalCheck.title')}
                  </H2>
                  <Paragraph>
                    {t('exportJourney.submitAnExport.finalCheck.description')}
                  </Paragraph>
                  <AppLink href="/dashboard">
                    {t('exportJourney.submitAnExport.returnLink')}
                  </AppLink>
                </Lower>
              </>
            )}
          </GovUK.GridCol>
        </GovUK.GridRow>
      </GovUK.Page>
    </>
  );
};

export default Tasklist;
