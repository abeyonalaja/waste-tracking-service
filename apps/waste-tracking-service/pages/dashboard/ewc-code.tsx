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
  ConditionalRadioWrap,
  SubmissionNotFound,
  Loading,
  ButtonGroup,
  SaveReturnButton,
} from '../../components';
import {
  isNotEmpty,
  validateDoYouHaveAnEWCCode,
  validateEwcCodes,
} from '../../utils/validators';

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
  const [id, setId] = useState(null);
  const [showInput, setShowInput] = useState(null);
  const [errors, setErrors] = useState<{
    doYouHaveEWCCode?: string;
    ewcCodes?: string;
  }>({});

  const [ewcCodesPage, dispatchEwcCodePage] = useReducer(
    ewcCodesReducer,
    initialEWCCodeState
  );

  useEffect(() => {
    if (router.isReady) {
      setId(router.query.id);
    }
  }, [router.isReady, router.query.id]);

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
            if (data.ewcCodes?.length > 0) {
              setShowInput('yes');
            }
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
        doYouHaveEWCCode: validateDoYouHaveAnEWCCode(showInput),
        ewcCodes: validateEwcCodes(ewcCodes, showInput),
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
              if (data !== undefined && showInput === 'yes') {
                const path = returnToDraft
                  ? '/submit-an-export-tasklist'
                  : '/dashboard/added-ewc-code';
                router.push({
                  pathname: path,
                  query: { id },
                });
              }
              if (data !== undefined && showInput === 'no') {
                const path = returnToDraft
                  ? '/submit-an-export-tasklist'
                  : '/national-code';
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
              pathname: '/waste-code',
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
        <title>{t('exportJourney.ewcCode.title')}</title>
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
                  <GovUK.Fieldset>
                    <GovUK.Fieldset.Legend isPageHeading size="LARGE">
                      {t('exportJourney.ewcCode.title')}
                    </GovUK.Fieldset.Legend>
                    <GovUK.MultiChoice
                      mb={6}
                      hint="An EWC code (European Waste Catalogue code) is also known as an EC list of waste code. You must include all 6 digits."
                      label=""
                      meta={{
                        error: errors?.doYouHaveEWCCode,
                        touched: !!errors?.doYouHaveEWCCode,
                      }}
                    >
                      <GovUK.Radio
                        name="showInput"
                        value="yes"
                        checked={showInput === 'yes'}
                        onChange={() => setShowInput('yes')}
                      >
                        {t('radio.yes')}
                      </GovUK.Radio>
                      {showInput === 'yes' && (
                        <ConditionalRadioWrap>
                          <GovUK.FormGroup error={!!errors?.ewcCodes}>
                            <GovUK.HintText>
                              {t('autocompleteHint')}
                            </GovUK.HintText>
                            <GovUK.ErrorText>
                              {errors?.ewcCodes}
                            </GovUK.ErrorText>

                            {!ewcCodesPage.isError &&
                              !ewcCodesPage.isLoading &&
                              ewcCodesPage.data.status === 'Started' &&
                              ewcCodesPage.data.ewcCodes && (
                                <Autocomplete
                                  id="ewcCodes"
                                  source={suggest}
                                  showAllValues
                                  onConfirm={(option) =>
                                    handleInputChange(option)
                                  }
                                  confirmOnBlur={false}
                                  defaultValue={ewcCodesPage.data.ewcCodes[0]}
                                  meta={{
                                    error: errors?.ewcCodes,
                                    touched: !!errors?.ewcCodes,
                                  }}
                                />
                              )}

                            {!ewcCodesPage.isError &&
                              !ewcCodesPage.isLoading &&
                              ewcCodesPage.data.status === 'Started' &&
                              !ewcCodesPage.data.ewcCodes && (
                                <Autocomplete
                                  id="ewcCodes"
                                  source={suggest}
                                  showAllValues
                                  onConfirm={(option) =>
                                    handleInputChange(option)
                                  }
                                  confirmOnBlur={false}
                                  meta={{
                                    error: errors?.ewcCodes,
                                    touched: !!errors?.ewcCodes,
                                  }}
                                />
                              )}
                          </GovUK.FormGroup>
                        </ConditionalRadioWrap>
                      )}
                      <GovUK.Radio
                        name="showInput"
                        value="no"
                        onChange={() => setShowInput('no')}
                        checked={showInput === 'no'}
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

export default EwcCode;
