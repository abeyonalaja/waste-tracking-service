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
  Paragraph,
  SubmissionNotFound,
  SaveReturnButton,
  Loading,
} from '../components';
import styled from 'styled-components';
import { BORDER_COLOUR } from 'govuk-colours';
import { Submission } from '@wts/api/waste-tracking-gateway';

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

const Lower = styled('div')`
  padding-top: 20px;
  padding-bottom: 60px;
`;

const TaskListOL = styled.ol`
  counter-reset: checkYourReport;
  list-style-type: none;
  padding-left: 0;
  margin-top: 0;
  margin-bottom: 0;
  max-width: 550px;
  > li {
    counter-increment: checkYourReport;
  }
`;

const TaskListSectionHeading = styled(GovUK.H2)`
  display: table;
  margin-top: 1em;
  margin-bottom: 1em;
  &:before {
    content: counter(checkYourReport) '.';
    display: inline-block;
    min-width: 1em;
    @media (min-width: 40.0625em) {
      min-width: 30px;
    }
  }
`;

const TaskListItems = styled(GovUK.UnorderedList)`
  padding: 0;
  margin: 0 0 40px;
  list-style: none;
  @media (min-width: 40.0625em) {
    padding-left: 30px;
    margin-bottom: 60px;
  }
`;

const TaskListItem = styled(GovUK.ListItem)`
  border-bottom: 1px solid ${BORDER_COLOUR};
  margin-bottom: 0 !important;
  padding-top: 10px;
  padding-bottom: 10px;
  overflow: hidden;
  &:first-child {
    border-top: 1px solid ${BORDER_COLOUR};
  }
`;

const TaskName = styled.span`
  display: block;
  @media (min-width: 28.125em) {
    float: left;
  }
`;

const TaskStatus = styled.span`
  margin-top: 10px;
  margin-bottom: 5px;
  display: inline-block;
  @media (min-width: 28.125em) {
    float: right;
    margin: 0;
  }
`;

const CheckYourReport = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [checkYourReportPage, dispatchCheckYourReportPage] = useReducer(
    checkYourReportReducer,
    initialWasteDescState
  );
  const [id, setId] = useState(null);
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
    }
  }, [checkYourReportPage.data]);

  const isSectionComplete = (sections) => {
    const completedSections = sections.filter((section) => {
      return checkYourReportPage.data[section].status === 'Complete';
    });
    return sections.length === completedSections.length;
  };

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
        <title>Check your report</title>
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
                {checkYourReportPage.data?.reference && (
                  <GovUK.Caption id="my-reference">
                    {t('exportJourney.submitAnExport.yourRef')}:{' '}
                    {checkYourReportPage.data?.reference}
                  </GovUK.Caption>
                )}

                <GovUK.Heading size="LARGE" id="template-heading">
                  Check your report
                </GovUK.Heading>
              </GovUK.GridCol>
            </GovUK.GridRow>
          </>
        )}
      </GovUK.Page>
    </>
  );
};

export default CheckYourReport;
