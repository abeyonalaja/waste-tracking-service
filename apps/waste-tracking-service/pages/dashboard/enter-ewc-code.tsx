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
import '../../i18n/config';
import { useTranslation } from 'react-i18next';
import {
  CompleteFooter,
  CompleteHeader,
  BreadcrumbWrap,
  Loading,
  SubmissionNotFound,
  ButtonGroup,
  SaveReturnButton,
  EwcCodeSelector,
} from '../../components';
import { isNotEmpty, validateEwcCodes } from '../../utils/validators';
import { GetWasteDescriptionResponse } from '@wts/api/waste-tracking-gateway';

type State = {
  data: { status: 'Started' } & GetWasteDescriptionResponse;
  isLoading: boolean;
  isError: boolean;
};

type Action = {
  type:
    | 'DATA_FETCH_INIT'
    | 'DATA_FETCH_SUCCESS'
    | 'DATA_FETCH_FAILURE'
    | 'DATA_UPDATE';
  payload?: { status: 'Started' } & GetWasteDescriptionResponse;
};

const initialEWCCodeState: State = {
  data: null,
  isLoading: true,
  isError: false,
};

const ewcCodesReducer = (state: State, action: Action) => {
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
        anything: 1,
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

const EwcCode = () => {
  const { t } = useTranslation();
  const router = useRouter();

  const [ewcCodesPage, dispatchEwcCodePage] = useReducer(
    ewcCodesReducer,
    initialEWCCodeState
  );

  const [id, setId] = useState(null);

  useEffect(() => {
    if (router.isReady) {
      setId(router.query.id);
    }
  }, [router.isReady, router.query.id]);

  const [errors, setErrors] = useState<{
    ewcCodes?: string;
  }>({});

  useEffect(() => {
    dispatchEwcCodePage({ type: 'DATA_FETCH_INIT' });
    if (id !== null) {
      fetch(
        `${process.env.NX_API_GATEWAY_URL}/submissions/${id}/waste-description`
      )
        .then((response) => {
          if (response.ok) return response.json();
          else {
            dispatchEwcCodePage({ type: 'DATA_FETCH_FAILURE' });
          }
        })
        .then((data) => {
          if (data !== undefined) {
            dispatchEwcCodePage({
              type: 'DATA_FETCH_SUCCESS',
              payload: data,
            });
          }
        });
    }
  }, [router.isReady, id]);

  const handleInputChange = (option) => {
    if (ewcCodesPage.data.ewcCodes) {
      const updatedEwcCodes = [
        ...new Set([...ewcCodesPage.data.ewcCodes, option]),
      ].slice(0, 5);
      if (updatedEwcCodes.length <= 5) {
        dispatchEwcCodePage({
          type: 'DATA_UPDATE',
          payload: {
            ...ewcCodesPage.data,
            ewcCodes: updatedEwcCodes,
          },
        });
        setErrors({});
      } else {
        setErrors({
          ewcCodes: 'You cannot add more than 5 EWC codes',
        });
      }
    } else {
      dispatchEwcCodePage({
        type: 'DATA_UPDATE',
        payload: { ...ewcCodesPage.data, ewcCodes: [option] },
      });
    }
  };

  const handleLinkSubmit = (e) => {
    handleSubmit(e, true);
  };

  const handleSubmit = useCallback(
    (e: FormEvent, returnToDraft = false) => {
      const ewcCodes = ewcCodesPage.data?.ewcCodes;

      const newErrors = {
        ewcCodes: validateEwcCodes(ewcCodes, 'yes'),
      };

      if (isNotEmpty(newErrors)) {
        setErrors(newErrors);
      } else {
        setErrors(null);
        try {
          fetch(
            `${process.env.NX_API_GATEWAY_URL}/submissions/${id}/waste-description`,
            {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(ewcCodesPage.data),
            }
          )
            .then((response) => {
              if (response.ok) return response.json();
            })
            .then((data) => {
              if (data !== undefined) {
                const path = returnToDraft
                  ? '/submit-an-export-tasklist'
                  : '/dashboard/added-ewc-code';
                router.push({
                  pathname: path,
                  query: { id },
                });
              }
            });
        } catch (e) {
          console.error(e);
        }
      }

      e.preventDefault();
    },
    [id, ewcCodesPage.data, router]
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

  return (
    <>
      <Head>
        <title>{t('exportJourney.enterEwcCode.title')}</title>
      </Head>
      <GovUK.Page
        id="content"
        header={<CompleteHeader />}
        footer={<CompleteFooter />}
        beforeChildren={<BreadCrumbs />}
      >
        <GovUK.GridRow>
          <GovUK.GridCol setWidth="two-thirds">
            {ewcCodesPage.isError && !ewcCodesPage.isLoading && (
              <SubmissionNotFound />
            )}
            {ewcCodesPage.isLoading && <Loading />}
            {!ewcCodesPage.isError && !ewcCodesPage.isLoading && (
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
                <form onSubmit={handleSubmit}>
                  <GovUK.Fieldset.Legend isPageHeading size="LARGE">
                    {t('exportJourney.enterEwcCode.title')}
                  </GovUK.Fieldset.Legend>
                  <GovUK.Fieldset>
                    <GovUK.FormGroup error={!!errors?.ewcCodes}>
                      <GovUK.HintText>{t('autocompleteHint')}</GovUK.HintText>
                      <GovUK.ErrorText>{errors?.ewcCodes}</GovUK.ErrorText>
                      <EwcCodeSelector
                        id="ewcCodes"
                        name="ewcCodes"
                        errorMessage={errors?.ewcCodes}
                        onChange={handleInputChange}
                      />
                    </GovUK.FormGroup>
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

export default EwcCode;
