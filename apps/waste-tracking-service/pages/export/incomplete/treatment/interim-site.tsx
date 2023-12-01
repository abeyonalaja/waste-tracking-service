import React, {
  FormEvent,
  useCallback,
  useEffect,
  useReducer,
  useState,
} from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import * as GovUK from 'govuk-react';

import { useTranslation } from 'react-i18next';
import {
  CompleteFooter,
  CompleteHeader,
  BreadcrumbWrap,
  SubmissionNotFound,
  Loading,
  ButtonGroup,
  SaveReturnButton,
  Paragraph,
} from 'components';

import { isNotEmpty, validateSelection } from 'utils/validators';

type State = {
  data: any;
  isLoading: boolean;
  isError: boolean;
  errors: any;
};

type Action = {
  type:
    | 'DATA_FETCH_INIT'
    | 'DATA_FETCH_SUCCESS'
    | 'DATA_FETCH_FAILURE'
    | 'DATA_UPDATE'
    | 'FACILITY_DATA_UPDATE'
    | 'ERRORS_UPDATE'
    | 'SHOW_VIEW';
  payload?: any;
};

const initialState: State = {
  data: null,
  isLoading: true,
  isError: false,
  errors: null,
};

const interimReducer = (state: State, action: Action) => {
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
    case 'ERRORS_UPDATE':
      return {
        ...state,
        errors: action.payload,
      };
    default:
      throw new Error();
  }
};

const InterimSiteDetails = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [interimPage, dispatchInterimPage] = useReducer(
    interimReducer,
    initialState
  );
  const [id, setId] = useState(null);
  const [hasInterimSite, setHasInterimSite] = useState(null);
  const [existingInterimSite, setExistingInterimSite] = useState(null);

  useEffect(() => {
    if (router.isReady) {
      setId(router.query.id);
    }
  }, [router.isReady, router.query.id]);

  useEffect(() => {
    dispatchInterimPage({ type: 'DATA_FETCH_INIT' });
    if (id !== null) {
      fetch(
        `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/submissions/${id}/recovery-facility`
      )
        .then((response) => {
          if (response.ok) return response.json();
          else {
            dispatchInterimPage({ type: 'DATA_FETCH_FAILURE' });
          }
        })
        .then((data) => {
          if (data !== undefined) {
            dispatchInterimPage({
              type: 'DATA_FETCH_SUCCESS',
              payload: data,
            });
            if (data.values !== undefined) {
              const interimSite = data.values.filter(
                (site) => site.recoveryFacilityType?.type === 'InterimSite'
              );
              const recoveryFacilities = data.values.filter(
                (site) => site.recoveryFacilityType?.type === 'RecoveryFacility'
              );
              if (interimSite.length > 0) {
                setHasInterimSite('Yes');
                setExistingInterimSite(interimSite[0].id);
              } else if (recoveryFacilities.length > 0) {
                setHasInterimSite('No');
              }
            }
          }
        });
    }
  }, [router.isReady, id]);

  const handleLinkSubmit = (e) => {
    handleSubmit(e, true);
  };

  const handleSubmit = useCallback(
    (e: FormEvent, returnToDraft = false) => {
      const newErrors = {
        hasInterimSite: validateSelection(
          hasInterimSite,
          'if the waste will go to an interim site'
        ),
      };
      if (isNotEmpty(newErrors)) {
        dispatchInterimPage({ type: 'ERRORS_UPDATE', payload: newErrors });
      } else {
        dispatchInterimPage({ type: 'ERRORS_UPDATE', payload: null });
        dispatchInterimPage({ type: 'DATA_FETCH_INIT' });

        if (hasInterimSite === 'Yes') {
          router.push({
            pathname: returnToDraft
              ? `/export/incomplete/tasklist`
              : `/export/incomplete/treatment/interim-site-details`,
            query: { id },
          });
        } else {
          if (existingInterimSite !== null) {
            removeExistingInterimSite(returnToDraft);
          } else {
            router.push({
              pathname: returnToDraft
                ? `/export/incomplete/tasklist`
                : `/export/incomplete/treatment/recovery-facility-details`,
              query: { id },
            });
          }
        }
      }
      e.preventDefault();
    },
    [interimPage.data, hasInterimSite]
  );

  const removeExistingInterimSite = (returnToDraft) => {
    try {
      fetch(
        `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/submissions/${id}/recovery-facility/${existingInterimSite}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      ).then(() => {
        router.push({
          pathname: returnToDraft
            ? `/export/incomplete/tasklist`
            : `/export/incomplete/treatment/recovery-facility-details`,
          query: { id },
        });
      });
    } catch (e) {
      console.error(e);
    }
  };

  const BreadCrumbs = () => {
    return (
      <BreadcrumbWrap>
        <GovUK.BackLink
          href="#"
          onClick={() => {
            router.push({
              pathname: `/export/incomplete/tasklist`,
              query: { id },
            });
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
        <title>{t('exportJourney.interimSite.confirmTitle')}</title>
      </Head>
      <GovUK.Page
        id="content"
        header={<CompleteHeader />}
        footer={<CompleteFooter />}
        beforeChildren={<BreadCrumbs />}
      >
        <GovUK.GridRow>
          <GovUK.GridCol setWidth="two-thirds">
            {interimPage.isError && !interimPage.isLoading && (
              <SubmissionNotFound />
            )}
            {interimPage.isLoading && <Loading />}
            {!interimPage.isError && !interimPage.isLoading && (
              <>
                {interimPage.errors &&
                  !!Object.keys(interimPage.errors).length && (
                    <GovUK.ErrorSummary
                      heading={t('errorSummary.title')}
                      errors={Object.keys(interimPage.errors).map((key) => ({
                        targetName: key,
                        text: interimPage.errors[key],
                      }))}
                    />
                  )}
                <GovUK.Caption size="L">
                  {t('exportJourney.recoveryFacilities.caption')}
                </GovUK.Caption>
                <form onSubmit={handleSubmit}>
                  <GovUK.Fieldset>
                    <GovUK.Fieldset.Legend isPageHeading size="LARGE">
                      {t('exportJourney.interimSite.confirmTitle')}
                    </GovUK.Fieldset.Legend>
                    <Paragraph>
                      {t('exportJourney.interimSite.confirmHint')}
                    </Paragraph>
                    <GovUK.Details
                      summary={t('exportJourney.interimSite.summary')}
                    >
                      {t('exportJourney.interimSite.details')}
                    </GovUK.Details>
                    <GovUK.MultiChoice
                      mb={6}
                      label=""
                      meta={{
                        error: interimPage.errors?.hasInterimSite,
                        touched: !!interimPage.errors?.hasInterimSite,
                      }}
                    >
                      <GovUK.Radio
                        name="removeTransitCountries"
                        id="removeTransitCountriesYes"
                        checked={hasInterimSite === 'Yes'}
                        onChange={(e) => setHasInterimSite(e.target.value)}
                        value="Yes"
                      >
                        {t('radio.yes')}
                      </GovUK.Radio>
                      <GovUK.Radio
                        name="removeTransitCountries"
                        id="removeTransitCountriesNo"
                        checked={hasInterimSite === 'No'}
                        onChange={(e) => setHasInterimSite(e.target.value)}
                        value="No"
                      >
                        {t('radio.no')}
                      </GovUK.Radio>
                    </GovUK.MultiChoice>
                  </GovUK.Fieldset>
                  <ButtonGroup>
                    <GovUK.Button id="saveButton">
                      {t('saveButton')}
                    </GovUK.Button>
                    <SaveReturnButton onClick={handleLinkSubmit} />
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

export default InterimSiteDetails;
