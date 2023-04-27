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
import Autocomplete from 'accessible-autocomplete/react';
import '../../i18n/config';
import { useTranslation } from 'react-i18next';
import {
  CompleteFooter,
  CompleteHeader,
  BreadcrumbWrap,
  SaveReturnLink,
} from '../../components';
import { validateEwcCodes } from '../../utils/validators';
import styled from 'styled-components';

import { GetWasteDescriptionResponse } from '@wts/api/waste-tracking-gateway';

function isNotEmpty(obj) {
  return Object.keys(obj).some((key) => obj[key]?.length > 0);
}

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

const Lower = styled('div')`
  padding-top: 30px;
  padding-bottom: 20px;
`;

const EwcCode = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [showInput, setShowInput] = useState(false);

  const handleRadioChange = (event) => {
    setShowInput(event.target.value === 'yes');
  };

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
    [id, ewcCodesPage.data, router, showInput]
  );

  function suggest(query, populateResults) {
    const results = [
      '010101: wastes from mineral metalliferous excavation',
      '010102: wastes from mineral non-metalliferous excavation',
      '010306: tailings other than those mentioned in 01 03 04 and 01 03 05',
      '010308: dusty and powdery wastes other than those mentioned in 01 03 07',
      '010309: red mud from alumina production other than the wastes mentioned in 01 03 10',
      '010399: wastes not otherwise specified',
      '010408: waste gravel and crushed rocks other than those mentioned in 01 04 07',
      '010409: waste sand and clays',
      '010410: dusty and powdery wastes other than those mentioned in 01 04 07',
      '010411: wastes from potash and rock salt processing other than those mentioned in 01 04 07',
    ];
    const filteredResults = results.filter(
      (result) => result.indexOf(query) !== -1
    );
    populateResults(filteredResults);
  }

  const BreadCrumbs = () => {
    return (
      <BreadcrumbWrap>
        <GovUK.BackLink
          href="#"
          onClick={() => {
            router.push({
              pathname: '/dashboard/added-ewc-code',
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
        <title>{t('exportJourney.ewcCodes.title')}</title>
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
              <p>No valid record found</p>
            )}
            {ewcCodesPage.isLoading && <p>Loading</p>}
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
                    <GovUK.HintText>{t('autocompleteHint')}</GovUK.HintText>
                    <Autocomplete
                      id="ewcCodes"
                      source={suggest}
                      showAllValues
                      onConfirm={(option) => handleInputChange(option)}
                      confirmOnBlur={false}
                      meta={{
                        error: errors?.ewcCodes,
                        touched: !!errors?.ewcCodes,
                      }}
                    />
                  </GovUK.Fieldset>
                  <Lower>
                    <GovUK.Button onSubmit={handleInputChange} id="saveButton">
                      {t('saveButton')}
                    </GovUK.Button>
                    <SaveReturnLink onClick={handleLinkSubmit} />
                  </Lower>
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
