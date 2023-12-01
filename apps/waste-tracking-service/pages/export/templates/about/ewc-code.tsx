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
import { useTranslation } from 'react-i18next';
import {
  CompleteFooter,
  CompleteHeader,
  ConditionalRadioWrap,
  BreadcrumbWrap,
  Loading,
  SubmissionNotFound,
  SaveReturnButton,
  ButtonGroup,
  Paragraph,
  AppLink,
} from 'components';
import {
  isNotEmpty,
  validateEwcCode,
  validateConfirmRemove,
} from 'utils/validators';
import { getStatus } from 'utils/statuses/getStatus';
import formatEwcCode from 'utils/formatEwcCode';
import styled from 'styled-components';
import { BORDER_COLOUR } from 'govuk-colours';
import i18n from 'i18next';

const VIEWS = {
  ADD_FORM: 1,
  LIST: 2,
  CONFIRM: 3,
};

type State = {
  data: any;
  isLoading: boolean;
  isError: boolean;
  showView: number;
  provided: string;
  errors: {
    hasCountries?: string;
    country?: string;
    changedCountry?: string;
    confirmRemove?: string;
  };
};

type Action = {
  type:
    | 'DATA_FETCH_INIT'
    | 'DATA_FETCH_SUCCESS'
    | 'DATA_FETCH_FAILURE'
    | 'DATA_UPDATE'
    | 'PROVIDED_UPDATE'
    | 'ERRORS_UPDATE'
    | 'SHOW_VIEW';
  payload?: any;
};

const initialState: State = {
  data: { status: 'Started', values: [] },
  isLoading: true,
  isError: false,
  showView: VIEWS.LIST,
  provided: null,
  errors: null,
};

const ewcCodeReducer = (state: State, action: Action) => {
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
    case 'PROVIDED_UPDATE':
      return {
        ...state,
        provided: action.payload,
      };
    case 'ERRORS_UPDATE':
      return {
        ...state,
        errors: action.payload,
      };
    case 'SHOW_VIEW':
      return {
        ...state,
        errors: null,
        isLoading: false,
        isError: false,
        showView: action.payload,
      };
    default:
      throw new Error();
  }
};

const EwcCodeInput = styled(GovUK.InputField)`
  input {
    max-width: 8em;
  }
`;

const DefinitionList = styled('dl')`
  margin-bottom: 20px;
  font-size: 16px;
  line-height: 1.25;
  @media (min-width: 40.0625em) {
    margin-bottom: 30px;
    display: table;
    width: 100%;
    table-layout: fixed;
    border-collapse: collapse;
    font-size: 19px;
    line-height: 1.35;
  }
`;

const Row = styled('div')`
  border-bottom: 1px solid ${BORDER_COLOUR};
  margin-bottom: 15px;
  @media (min-width: 40.0625em) {
    display: table-row;
  }
`;

const Title = styled('dt')`
  margin-bottom: 5px;
  font-weight: 700;
  @media (min-width: 40.0625em) {
    display: table-cell;
    padding-top: 10px;
    padding-right: 20px;
    padding-bottom: 10px;
    margin-bottom: 5px;
    width: 18%;
  }
`;

const Definition = styled('dd')`
  margin-bottom: 5px;
  margin-left: 0;
  @media (min-width: 40.0625em) {
    display: table-cell;
    padding-top: 10px;
    padding-right: 20px;
    padding-bottom: 10px;
    margin-bottom: 5px;
    width: 68%;
  }
  &::first-letter {
    text-transform: uppercase;
  }
`;

const Actions = styled('dd')`
  margin: 10px 0 15px;
  @media (min-width: 40.0625em) {
    width: 14%;
    display: table-cell;
    padding-top: 10px;
    padding-bottom: 10px;
    margin-bottom: 5px;
    text-align: right;
  }
  a {
    margin-right: 10px;
    @media (min-width: 40.0625em) {
      margin: 0 0 0 15px;
    }
  }
`;

type codeType = {
  code: string;
  description: string;
};

const EwcCodes = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [ewcCodePage, dispatchEwcCodePage] = useReducer(
    ewcCodeReducer,
    initialState
  );
  const [templateId, setTemplateId] = useState(null);
  const [refData, setRefData] = useState<Array<codeType>>([]);
  const [ewcCode, setEwcCode] = useState('');
  const [ewcCodeToRemove, setEwcCodeToRemove] = useState<string>(null);
  const [confirmRemove, setConfirmRemove] = useState(null);

  useEffect(() => {
    if (router.isReady) {
      setTemplateId(router.query.templateId);
    }
  }, [router.isReady, router.query.templateId]);

  const currentLanguage = i18n.language;

  useEffect(() => {
    const fetchData = async () => {
      await fetch(
        `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/wts-info/ewc-codes?language=${currentLanguage}`
      )
        .then((response) => {
          if (response.ok) return response.json();
        })
        .then((data) => {
          if (data !== undefined) {
            setRefData(data);
          }
        });
    };
    if (currentLanguage) {
      fetchData();
    }
  }, [currentLanguage]);

  useEffect(() => {
    dispatchEwcCodePage({ type: 'DATA_FETCH_INIT' });
    if (templateId !== null) {
      fetch(
        `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/templates/${templateId}/waste-description`
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
            if (data.ewcCodes === undefined || data.ewcCodes.length === 0) {
              dispatchEwcCodePage({
                type: 'SHOW_VIEW',
                payload: VIEWS.ADD_FORM,
              });
            }
          }
        });
    }
  }, [router.isReady, templateId]);

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      const newEwcCode = ewcCode.replace(/[A-Z-_|.* ]/gi, '');
      const newErrors = {
        ewcCode:
          validateEwcCode('Yes', newEwcCode) || checkValidEWC(newEwcCode),
      };

      if (isNotEmpty(newErrors) && ewcCode) {
        dispatchEwcCodePage({ type: 'ERRORS_UPDATE', payload: newErrors });
      } else {
        dispatchEwcCodePage({ type: 'ERRORS_UPDATE', payload: null });

        if (ewcCode) {
          const result = { code: newEwcCode };
          ewcCodePage.data.status = getStatus(
            ewcCodePage.data?.wasteCode,
            [result],
            ewcCodePage.data?.nationalCode,
            ewcCodePage.data?.description
          );

          const body = { ...ewcCodePage.data, ewcCodes: [result] };

          try {
            fetch(
              `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/templates/${templateId}/waste-description`,
              {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
              }
            )
              .then((response) => {
                if (response.ok) return response.json();
              })
              .then((data) => {
                if (data !== undefined) {
                  dispatchEwcCodePage({
                    type: 'DATA_UPDATE',
                    payload: data,
                  });
                  dispatchEwcCodePage({
                    type: 'SHOW_VIEW',
                    payload: VIEWS.LIST,
                  });
                }
              });
          } catch (e) {
            console.error(e);
          }
        } else {
          router.push({
            pathname: `/export/templates/about/national-code`,
            query: { templateId },
          });
        }
      }

      e.preventDefault();
    },
    [templateId, ewcCode, ewcCodePage, router]
  );

  const checkDuplicate = (ewcCode) => {
    const result = ewcCodePage.data.ewcCodes.find(
      ({ code }) => code.slice(0, 6) === ewcCode
    );
    if (result !== undefined) {
      return `You have already entered this code`;
    }
  };

  const checkValidEWC = (ewcCode) => {
    if (ewcCode === '') {
      return null;
    }
    const result = refData.find(({ code }) => code.slice(0, 6) === ewcCode);
    if (result === undefined) {
      return 'Enter a code in the correct format';
    }
  };

  const getEWCDesc = (ewcCode) => {
    const result = refData.find(({ code }) => code.slice(0, 6) === ewcCode);
    if (result) {
      return result.description;
    }
  };

  const handleSubmitAdditionalEwcCode = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      const hasEWCCode = ewcCodePage.provided;
      const newEwcCode = ewcCode.replace(/[A-Z-_|.* ]/gi, '');
      const newErrors = {
        ewcCode:
          hasEWCCode &&
          (validateEwcCode(hasEWCCode, newEwcCode) ||
            checkDuplicate(newEwcCode) ||
            checkValidEWC(newEwcCode)),
      };

      if (isNotEmpty(newErrors)) {
        dispatchEwcCodePage({ type: 'ERRORS_UPDATE', payload: newErrors });
      } else {
        dispatchEwcCodePage({ type: 'ERRORS_UPDATE', payload: null });

        if (hasEWCCode === 'No') {
          router.push({
            pathname: `/export/templates/about/national-code`,
            query: { templateId },
          });
        } else if (hasEWCCode === 'Yes') {
          const ewcCodes = ewcCodePage.data.ewcCodes;
          const additionalEwc = {
            code: newEwcCode,
          };
          ewcCodes.push(additionalEwc);
          updateEwcData(ewcCodes, false);
        } else {
          router.push({
            pathname: `/export/templates/about/national-code`,
            query: { templateId },
          });
        }
      }
    },
    [ewcCode, ewcCodePage]
  );

  const handleConfirmRemove = useCallback(
    (e, returnToDraft = false) => {
      const newErrors = {
        confirmRemove: validateConfirmRemove(confirmRemove, 'EWC code'),
      };
      if (isNotEmpty(newErrors)) {
        dispatchEwcCodePage({ type: 'ERRORS_UPDATE', payload: newErrors });
      } else {
        dispatchEwcCodePage({ type: 'ERRORS_UPDATE', payload: null });
        const callBack = () => {
          dispatchEwcCodePage({
            type: 'SHOW_VIEW',
            payload: VIEWS.LIST,
          });
        };
        if (confirmRemove === 'No' && !returnToDraft) {
          callBack();
        } else if (confirmRemove === 'No' && returnToDraft) {
          router.push({
            pathname: `/export/templates/tasklist`,
            query: { templateId },
          });
        } else {
          const ewcCodes = ewcCodePage.data.ewcCodes.filter(
            (ewcCode) => ewcCode.code !== ewcCodeToRemove
          );
          if (ewcCodes.length === 0) {
            delete ewcCodePage.data.ewcCodes;
          }
          updateEwcData(ewcCodes, returnToDraft, callBack);
        }
        setConfirmRemove(null);
      }
      e.preventDefault();
    },
    [confirmRemove, ewcCodeToRemove, ewcCodePage]
  );

  const updateEwcData = (ewcCodes, returnToDraft, callBack?) => {
    ewcCodePage.data.status = getStatus(
      ewcCodePage.data?.wasteCode,
      ewcCodes,
      ewcCodePage.data?.nationalCode,
      ewcCodePage.data?.description
    );
    let body = ewcCodePage.data;
    if (ewcCodes.length > 0) {
      body = { ...ewcCodePage.data, ewcCodes: ewcCodes };
    }
    try {
      fetch(
        `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/templates/${templateId}/waste-description`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        }
      )
        .then((response) => {
          if (response.ok) return response.json();
        })
        .then((data) => {
          if (data !== undefined) {
            setEwcCode('');
            dispatchEwcCodePage({
              type: 'PROVIDED_UPDATE',
              payload: null,
            });
            dispatchEwcCodePage({
              type: 'DATA_UPDATE',
              payload: data,
            });
            if (typeof callBack === 'function') {
              callBack();
            }
            if (returnToDraft) {
              router.push({
                pathname: `/export/templates/tasklist`,
                query: { templateId },
              });
            } else {
              if (ewcCodes.length === 0) {
                dispatchEwcCodePage({
                  type: 'PROVIDED_UPDATE',
                  payload: null,
                });
                dispatchEwcCodePage({
                  type: 'SHOW_VIEW',
                  payload: VIEWS.ADD_FORM,
                });
              }
            }
          }
        });
    } catch (e) {
      console.error(e);
    }
  };

  const handleRadioChange = (input) => {
    setEwcCode('');
    dispatchEwcCodePage({
      type: 'PROVIDED_UPDATE',
      payload: input.target.value,
    });
  };

  const handleDelete = (e, ewcCode) => {
    setEwcCodeToRemove(ewcCode);
    dispatchEwcCodePage({
      type: 'SHOW_VIEW',
      payload: VIEWS.CONFIRM,
    });
    e.preventDefault();
  };

  const handleCancelReturn = (e) => {
    e.preventDefault();
    router.push({
      pathname: `/export/templates/tasklist`,
      query: { templateId },
    });
  };

  const BreadCrumbs = () => {
    return (
      <BreadcrumbWrap>
        <GovUK.BackLink
          href="#"
          onClick={() => {
            if (ewcCodePage.showView === VIEWS.CONFIRM) {
              dispatchEwcCodePage({
                type: 'SHOW_VIEW',
                payload: VIEWS.LIST,
              });
            } else {
              router.push({
                pathname: router.query.dashboard
                  ? `/export/templates/tasklist`
                  : `/export/templates/about/waste-code`,
                query: { templateId },
              });
            }
          }}
        >
          {t('back')}
        </GovUK.BackLink>
      </BreadcrumbWrap>
    );
  };

  return (
    <>
      <Head>
        <title>{t('exportJourney.ewc.title')}</title>
      </Head>
      <GovUK.Page
        id="content"
        header={<CompleteHeader />}
        footer={<CompleteFooter />}
        beforeChildren={<BreadCrumbs />}
      >
        <GovUK.GridRow>
          <GovUK.GridCol setWidth="two-thirds">
            {ewcCodePage.isError && !ewcCodePage.isLoading && (
              <SubmissionNotFound />
            )}
            {ewcCodePage.isLoading && <Loading />}
            {!ewcCodePage.isError && !ewcCodePage.isLoading && (
              <>
                {ewcCodePage.errors &&
                  !!Object.keys(ewcCodePage.errors).length && (
                    <GovUK.ErrorSummary
                      heading={t('errorSummary.title')}
                      errors={Object.keys(ewcCodePage.errors).map((key) => ({
                        targetName: key,
                        text: ewcCodePage.errors[key],
                      }))}
                    />
                  )}
                <GovUK.Caption size="L">
                  {t('exportJourney.wasteCodesAndDesc.caption')}
                </GovUK.Caption>
                {ewcCodePage.showView === VIEWS.LIST && (
                  <>
                    <GovUK.Heading size="L">
                      {ewcCodePage.data.ewcCodes.length === 1
                        ? t('exportJourney.ewc.listTitleSingle')
                        : t('exportJourney.ewc.listTitleMultiple', {
                            count: ewcCodePage.data.ewcCodes.length,
                          })}
                    </GovUK.Heading>

                    <DefinitionList id="ewc-code-list">
                      {ewcCodePage.data.ewcCodes.map((ewc, index) => {
                        return (
                          <Row key={index}>
                            <Title id={`ewc-code-${index + 1}`}>
                              {formatEwcCode(ewc.code)}
                            </Title>
                            <Definition id={`ewc-desc-${index + 1}`}>
                              {getEWCDesc(ewc.code)}
                            </Definition>
                            <Actions>
                              <AppLink
                                key={`action-${index}-remove`}
                                href="#"
                                id={`action-remove-${index + 1}`}
                                onClick={(e) => handleDelete(e, ewc.code)}
                              >
                                {t('actions.remove')}
                              </AppLink>
                            </Actions>
                          </Row>
                        );
                      })}
                    </DefinitionList>
                    {ewcCodePage.data.ewcCodes.length > 4 ? (
                      <>
                        <GovUK.Heading as="p" size={'MEDIUM'}>
                          {t('exportJourney.ewc.maxReached')}
                        </GovUK.Heading>
                        <ButtonGroup>
                          <GovUK.Button
                            id="saveButton"
                            onClick={() =>
                              router.push({
                                pathname: `/export/templates/about/national-code`,
                                query: { templateId },
                              })
                            }
                          >
                            {t('saveButton')}
                          </GovUK.Button>
                          <SaveReturnButton
                            onClick={() =>
                              router.push({
                                pathname: `/export/templates/tasklist`,
                                query: { templateId },
                              })
                            }
                          />
                        </ButtonGroup>
                      </>
                    ) : (
                      <form onSubmit={handleSubmitAdditionalEwcCode}>
                        <GovUK.Fieldset>
                          <GovUK.Fieldset.Legend size="M">
                            {t('exportJourney.ewc.addAnotherTitle')}
                          </GovUK.Fieldset.Legend>
                          <GovUK.MultiChoice
                            mb={6}
                            label=""
                            meta={{
                              error: ewcCodePage.errors?.hasEWCCode,
                              touched: !!ewcCodePage.errors?.hasEWCCode,
                            }}
                          >
                            <GovUK.Radio
                              name="hasEWCCode"
                              id="hasEWCCodeYes"
                              checked={ewcCodePage.provided === 'Yes'}
                              onChange={(e) => handleRadioChange(e)}
                              value="Yes"
                            >
                              {t('radio.yes')}
                            </GovUK.Radio>
                            {ewcCodePage.provided === 'Yes' && (
                              <ConditionalRadioWrap>
                                <GovUK.FormGroup>
                                  <EwcCodeInput
                                    input={{
                                      name: 'ewc-code',
                                      id: 'ewc-code',
                                      maxLength: 8,
                                      type: 'text',
                                      inputMode: 'numeric',
                                      value: ewcCode,
                                      onChange: (e) =>
                                        setEwcCode(e.target.value),
                                    }}
                                    meta={{
                                      error: ewcCodePage.errors?.ewcCode,
                                      touched: !!ewcCodePage.errors?.ewcCode,
                                    }}
                                  >
                                    {t('exportJourney.ewc.label')}
                                  </EwcCodeInput>
                                </GovUK.FormGroup>
                              </ConditionalRadioWrap>
                            )}
                            <GovUK.Radio
                              name="hasEWCCode"
                              id="hasEWCCodeNo"
                              checked={ewcCodePage.provided === 'No'}
                              onChange={(e) => handleRadioChange(e)}
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
                          <SaveReturnButton onClick={handleCancelReturn}>
                            {t('templates.cancelReturnButton')}
                          </SaveReturnButton>
                        </ButtonGroup>
                      </form>
                    )}
                  </>
                )}
                {ewcCodePage.showView === VIEWS.ADD_FORM && (
                  <>
                    <form onSubmit={handleSubmit}>
                      <GovUK.Fieldset>
                        <GovUK.Fieldset.Legend isPageHeading size="LARGE">
                          {t('exportJourney.ewc.title')}
                        </GovUK.Fieldset.Legend>
                        <Paragraph>
                          This can also be called a list of waste (LoW) code.
                          For more help with these codes,{' '}
                          <AppLink
                            href="https://assets.publishing.service.gov.uk/government/uploads/system/uploads/attachment_data/file/1021051/Waste_classification_technical_guidance_WM3.pdf"
                            target="_blank"
                          >
                            see the waste classification guidance (opens in new
                            tab)
                          </AppLink>
                          .
                        </Paragraph>
                        <GovUK.FormGroup>
                          <EwcCodeInput
                            input={{
                              name: 'ewc-code',
                              id: 'ewc-code',
                              maxLength: 8,
                              type: 'text',
                              inputMode: 'numeric',
                              onChange: (e) => setEwcCode(e.target.value),
                            }}
                            meta={{
                              error: ewcCodePage.errors?.ewcCode,
                              touched: !!ewcCodePage.errors?.ewcCode,
                            }}
                          >
                            {t('exportJourney.ewc.label')}
                          </EwcCodeInput>
                        </GovUK.FormGroup>
                      </GovUK.Fieldset>
                      <ButtonGroup>
                        <GovUK.Button id="saveButton">
                          {t('saveButton')}
                        </GovUK.Button>
                        <SaveReturnButton onClick={handleCancelReturn}>
                          {t('templates.cancelReturnButton')}
                        </SaveReturnButton>
                      </ButtonGroup>
                    </form>
                  </>
                )}
                {ewcCodePage.showView === VIEWS.CONFIRM && (
                  <>
                    <form onSubmit={handleConfirmRemove}>
                      <GovUK.Fieldset>
                        <GovUK.Fieldset.Legend isPageHeading size="LARGE">
                          {t('exportJourney.ewc.confirmRemoveTitle', {
                            code: formatEwcCode(ewcCodeToRemove),
                          })}
                        </GovUK.Fieldset.Legend>
                        <GovUK.MultiChoice
                          mb={6}
                          label=""
                          meta={{
                            error: ewcCodePage.errors?.confirmRemove,
                            touched: !!ewcCodePage.errors?.confirmRemove,
                          }}
                        >
                          <GovUK.Radio
                            name="removeEwcCode"
                            id="removeEwcCodeYes"
                            checked={confirmRemove === 'Yes'}
                            onChange={(e) => setConfirmRemove(e.target.value)}
                            value="Yes"
                          >
                            {t('radio.yes')}
                          </GovUK.Radio>
                          <GovUK.Radio
                            name="removeEwcCode"
                            id="removeEwcCodeNo"
                            checked={confirmRemove === 'No'}
                            onChange={(e) => setConfirmRemove(e.target.value)}
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
                        <SaveReturnButton onClick={handleCancelReturn}>
                          {t('templates.cancelReturnButton')}
                        </SaveReturnButton>
                      </ButtonGroup>
                    </form>
                  </>
                )}
              </>
            )}
          </GovUK.GridCol>
        </GovUK.GridRow>
      </GovUK.Page>
    </>
  );
};

export default EwcCodes;
