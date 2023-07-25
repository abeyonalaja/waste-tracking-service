import React, {
  FormEvent,
  useCallback,
  useEffect,
  useState,
  useReducer,
} from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import * as GovUK from 'govuk-react';
import '../i18n/config';
import { useTranslation } from 'react-i18next';
import {
  CompleteFooter,
  CompleteHeader,
  BreadcrumbWrap,
  SubmissionNotFound,
  Loading,
  SaveReturnButton,
  ButtonGroup,
} from '../components';

import styled from 'styled-components';

import {
  GetSubmissionDeclarationResponse,
  Submission,
} from '@wts/api/waste-tracking-gateway';

type State = {
  data: Submission;
  isLoading: boolean;
  isError: boolean;
};

type Action = {
  type:
    | 'DATA_FETCH_INIT'
    | 'DATA_FETCH_SUCCESS'
    | 'DATA_FETCH_FAILURE'
    | 'DATA_UPDATE';
  payload?: Submission;
};

const initialWasteDescState: State = {
  data: null,
  isLoading: true,
  isError: false,
};

const exportSubmittedReducer = (state: State, action: Action) => {
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
    case 'DATA_UPDATE':
      return {
        ...state,
        data: { ...state.data, ...action.payload },
      };
    default:
      throw new Error();
  }
};

const StyledHeading = styled(GovUK.Heading)`
  margin-bottom: 15px;
`;

const ExportSubmitted = () => {
  const { t } = useTranslation();
  const router = useRouter();

  const [exportSubmittedPage, dispatchExportSubmittedPage] = useReducer(
    exportSubmittedReducer,
    initialWasteDescState
  );

  const [id, setId] = useState(null);

  useEffect(() => {
    if (router.isReady) {
      setId(router.query.id);
    }
  }, [router.isReady, router.query.id]);

  console.log(id);
  const [errors] = useState<{
    description?: string;
  }>({});

  useEffect(() => {
    dispatchExportSubmittedPage({ type: 'DATA_FETCH_INIT' });

    if (id !== null) {
      console.log('Win');
      fetch(`${process.env.NX_API_GATEWAY_URL}/submissions/${id}`)
        .then((response) => {
          if (response.ok) return response.json();
          else {
            dispatchExportSubmittedPage({ type: 'DATA_FETCH_FAILURE' });
            console.log('fail');
          }
        })
        .then((data) => {
          if (data !== undefined) {
            dispatchExportSubmittedPage({
              type: 'DATA_FETCH_SUCCESS',
              payload: data,
            });
            console.log('success');
          }
        });
    }
  }, [router.isReady, id]);

  console.log(exportSubmittedPage.data);

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

  return (
    <>
      <Head>
        <title>Export submitted</title>
      </Head>
      <GovUK.Page
        id="content"
        header={<CompleteHeader />}
        footer={<CompleteFooter />}
        beforeChildren={<BreadCrumbs />}
      >
        <GovUK.GridRow>
          <GovUK.GridCol setWidth="two-thirds">
            {exportSubmittedPage.isError && !exportSubmittedPage.isLoading && (
              <SubmissionNotFound />
            )}
            {exportSubmittedPage.isLoading && <Loading />}
            {!exportSubmittedPage.isError && !exportSubmittedPage.isLoading && (
              <>
                {errors && !!Object.keys(errors).length && (
                  <GovUK.ErrorSummary
                    heading={t('errorSummary.title')}
                    errors={Object.keys(errors).map((key) => ({
                      targetName: key,
                      text: errors[key],
                    }))}
                  />
                )}

                <GovUK.Panel title="Export submitted - plus code thing">
                  Export submitted - {exportSubmittedPage.data.id}
                </GovUK.Panel>

                <StyledHeading size="LARGE">
                  Export submitted - {exportSubmittedPage.data.id}
                </StyledHeading>

                <form>
                  <ButtonGroup>
                    <GovUK.Button id="saveButton">
                      {t('saveButton')}
                    </GovUK.Button>
                    <SaveReturnButton />
                  </ButtonGroup>
                </form>
              </>
            )}
          </GovUK.GridCol>
        </GovUK.GridRow>
      </GovUK.Page>
    </>
  );
};

export default ExportSubmitted;
