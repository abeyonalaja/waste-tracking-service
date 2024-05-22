import React, { useCallback, useEffect, useState, useReducer } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import * as GovUK from 'govuk-react';

import { useTranslation } from 'react-i18next';
import {
  Footer,
  Header,
  BreadcrumbWrap,
  SubmissionNotFound,
  Loading,
  SaveReturnButton,
  ButtonGroup,
} from 'components';

import styled from 'styled-components';

import { DraftSubmission } from '@wts/api/waste-tracking-gateway';
import useApiConfig from 'utils/useApiConfig';

interface State {
  data: DraftSubmission;
  isLoading: boolean;
  isError: boolean;
}

interface Action {
  type:
    | 'DATA_FETCH_INIT'
    | 'DATA_FETCH_SUCCESS'
    | 'DATA_FETCH_FAILURE'
    | 'DATA_UPDATE';
  payload?: DraftSubmission;
}

const initialWasteDescState: State = {
  data: null,
  isLoading: true,
  isError: false,
};

const SignDeclarationReducer = (state: State, action: Action) => {
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
        data: action.payload,
      };
    default:
      throw new Error();
  }
};

const StyledHeading = styled(GovUK.Heading)`
  margin-bottom: 15px;
`;

const SignDeclaration = () => {
  const { t } = useTranslation();
  const router = useRouter();

  const [signDeclarationPage, dispatchSignDeclarationPage] = useReducer(
    SignDeclarationReducer,
    initialWasteDescState
  );

  const [id, setId] = useState(null);
  const apiConfig = useApiConfig();

  useEffect(() => {
    if (router.isReady) {
      setId(router.query.id);
    }
  }, [router.isReady, router.query.id]);

  useEffect(() => {
    const fetchData = async () => {
      dispatchSignDeclarationPage({ type: 'DATA_FETCH_INIT' });
      if (id !== null) {
        await fetch(
          `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/submissions/${id}`,
          {
            headers: apiConfig,
          }
        )
          .then((response) => {
            if (response.ok) return response.json();
            else {
              dispatchSignDeclarationPage({ type: 'DATA_FETCH_FAILURE' });
            }
          })
          .then((data) => {
            if (data !== undefined) {
              dispatchSignDeclarationPage({
                type: 'DATA_FETCH_SUCCESS',
                payload: data,
              });
            }
          });
      }
    };
    fetchData();
  }, [router.isReady, id]);

  const handleConfirmClick = useCallback(
    async (e) => {
      e.preventDefault();
      await fetch(
        `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/submissions/${id}/submission-declaration`,
        {
          method: 'PUT',
          headers: apiConfig,
          body: JSON.stringify({
            status: 'Complete',
          }),
        }
      )
        .then((response) => {
          if (response.ok) return response.json();
        })
        .then((data) => {
          if (data !== undefined) {
            router.push({
              pathname: `/submitted/export-submitted`,
              query: { id },
            });
          }
        });
    },
    [id, router, signDeclarationPage.data]
  );

  if (signDeclarationPage.data?.submissionDeclaration.status === 'Complete') {
    router.push('/');
  }

  const BreadCrumbs = () => {
    return (
      <BreadcrumbWrap>
        <GovUK.BackLink
          href="#"
          onClick={() => {
            history.back();
          }}
        >
          {t('Back')}
        </GovUK.BackLink>
      </BreadcrumbWrap>
    );
  };

  return (
    <>
      <Head>
        <title>{t('exportJourney.checkAnswers.signDeclaration.title')}</title>
      </Head>
      <GovUK.Page
        id="content"
        header={<Header />}
        footer={<Footer />}
        beforeChildren={<BreadCrumbs />}
      >
        <GovUK.GridRow>
          <GovUK.GridCol setWidth="two-thirds">
            {signDeclarationPage.isError && !signDeclarationPage.isLoading && (
              <SubmissionNotFound />
            )}
            {signDeclarationPage.isLoading && <Loading />}
            {!signDeclarationPage.isError && !signDeclarationPage.isLoading && (
              <>
                <StyledHeading size="LARGE">
                  {t('exportJourney.checkAnswers.signDeclaration.title')}
                </StyledHeading>
                <GovUK.Paragraph id="first-paragraph">
                  {t('exportJourney.checkAnswers.signDeclaration.paragraph')}
                </GovUK.Paragraph>
                {signDeclarationPage.data.wasteDescription.status ===
                  'Complete' && (
                  <GovUK.UnorderedList>
                    <GovUK.ListItem>
                      {t(
                        'exportJourney.checkAnswers.signDeclaration.listItemOne'
                      )}
                    </GovUK.ListItem>
                    {signDeclarationPage.data?.wasteDescription?.wasteCode
                      .type !== 'NotApplicable' && (
                      <GovUK.ListItem id="conditional-item">
                        {t(
                          'exportJourney.checkAnswers.signDeclaration.listItemTwo'
                        )}
                      </GovUK.ListItem>
                    )}

                    <GovUK.ListItem>
                      {t(
                        'exportJourney.checkAnswers.signDeclaration.listItemThree'
                      )}
                    </GovUK.ListItem>

                    <GovUK.ListItem>
                      {t(
                        'exportJourney.checkAnswers.signDeclaration.listItemFour'
                      )}
                    </GovUK.ListItem>
                  </GovUK.UnorderedList>
                )}
                <ButtonGroup>
                  <GovUK.Button id="saveButton" onClick={handleConfirmClick}>
                    {t(
                      'exportJourney.checkAnswers.signDeclaration.confirmButton'
                    )}
                  </GovUK.Button>
                  <SaveReturnButton
                    onClick={() =>
                      router.push({
                        pathname: `/incomplete/tasklist`,
                        query: { id },
                      })
                    }
                  >
                    {t('exportJourney.checkAnswers.returnButton')}
                  </SaveReturnButton>
                </ButtonGroup>
              </>
            )}
          </GovUK.GridCol>
        </GovUK.GridRow>
      </GovUK.Page>
    </>
  );
};

export default SignDeclaration;
SignDeclaration.auth = true;
