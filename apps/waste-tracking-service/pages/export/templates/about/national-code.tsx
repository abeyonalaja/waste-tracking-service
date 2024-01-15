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
  Footer,
  Header,
  ConditionalRadioWrap,
  BreadcrumbWrap,
  Loading,
  SubmissionNotFound,
  SaveReturnButton,
  ButtonGroup,
} from 'components';
import { isNotEmpty, validateNationalCode } from 'utils/validators';
import { getApiConfig } from 'utils/api/apiConfig';
import { PageProps } from 'types/wts';

export const getServerSideProps = async (context) => {
  return getApiConfig(context);
};

const nationalCodeReducer = (state, action) => {
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
        data: { ...state.data, nationalCode: action.payload },
      };
    default:
      throw new Error();
  }
};

const NationalCode = ({ apiConfig }: PageProps) => {
  const { t } = useTranslation();
  const router = useRouter();

  const [nationalCodePage, dispatchNationalCodePage] = useReducer(
    nationalCodeReducer,
    { data: {}, isLoading: true, isError: false }
  );

  const [templateId, setTemplateId] = useState(null);

  useEffect(() => {
    if (router.isReady) {
      setTemplateId(router.query.templateId);
    }
  }, [router.isReady, router.query.templateId]);

  const [errors, setErrors] = useState<{
    nationalCode?: string;
  }>({});

  useEffect(() => {
    const fetchData = async () => {
      dispatchNationalCodePage({ type: 'DATA_FETCH_INIT' });
      if (templateId !== null) {
        await fetch(
          `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/templates/${templateId}/waste-description`,
          { headers: apiConfig }
        )
          .then((response) => {
            if (response.ok) return response.json();
            else {
              dispatchNationalCodePage({ type: 'DATA_FETCH_FAILURE' });
            }
          })
          .then((data) => {
            if (data !== undefined) {
              if (data.status === 'NotStarted') {
                data = { status: 'Started' };
              }
              dispatchNationalCodePage({
                type: 'DATA_FETCH_SUCCESS',
                payload: data,
              });
            }
          });
      }
    };
    fetchData();
  }, [router.isReady, templateId]);

  const handleInputChange = (input) => {
    let payload;
    switch (input.target.name) {
      case 'nationalCode':
        payload = { provided: 'Yes', value: input.target.value };
        break;
      case 'hasNationalCode':
        payload = { provided: input.target.value };
        break;
    }
    dispatchNationalCodePage({
      type: 'DATA_UPDATE',
      payload: payload,
    });
  };

  const handleCancelReturn = (e) => {
    e.preventDefault();
    router.push({
      pathname: `/export/templates/tasklist`,
      query: { templateId },
    });
  };

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      const nationalCode = nationalCodePage.data.nationalCode?.value;
      const hasNationalCode = nationalCodePage.data.nationalCode?.provided;

      const body = JSON.stringify(nationalCodePage.data);

      if (hasNationalCode) {
        const newErrors = {
          nationalCode: validateNationalCode(hasNationalCode, nationalCode),
        };

        if (isNotEmpty(newErrors)) {
          setErrors(newErrors);
        } else {
          setErrors(null);
          try {
            await fetch(
              `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/templates/${templateId}/waste-description`,
              {
                method: 'PUT',
                headers: apiConfig,
                body: body,
              }
            )
              .then((response) => {
                if (response.ok) return response.json();
              })
              .then((data) => {
                if (data !== undefined) {
                  router.push({
                    pathname: `/export/templates/about/description`,
                    query: { templateId },
                  });
                }
              });
          } catch (e) {
            console.error(e);
          }
        }
      } else {
        router.push({
          pathname: `/export/templates/about/description`,
          query: { templateId },
        });
      }
    },
    [templateId, nationalCodePage.data, router]
  );

  const BreadCrumbs = () => {
    return (
      <BreadcrumbWrap>
        <GovUK.BackLink
          href="#"
          onClick={() => {
            router.push({
              pathname: '/export/templates/about/ewc-code',
              query: { templateId },
            });
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
        <title>{t('exportJourney.nationalCode.title')}</title>
      </Head>
      <GovUK.Page
        id="content"
        header={<Header />}
        footer={<Footer />}
        beforeChildren={<BreadCrumbs />}
      >
        <GovUK.GridRow>
          <GovUK.GridCol setWidth="two-thirds">
            {nationalCodePage.isError && !nationalCodePage.isLoading && (
              <SubmissionNotFound />
            )}
            {nationalCodePage.isLoading && <Loading />}
            {!nationalCodePage.isError && !nationalCodePage.isLoading && (
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
                <GovUK.Caption size="L">
                  {t('exportJourney.wasteCodesAndDesc.caption')}
                </GovUK.Caption>
                <form onSubmit={handleSubmit}>
                  <GovUK.Fieldset>
                    <GovUK.Fieldset.Legend isPageHeading size="LARGE">
                      {t('exportJourney.nationalCode.title')}
                    </GovUK.Fieldset.Legend>
                    <GovUK.Paragraph>
                      {t('exportJourney.nationalCode.intro')}
                    </GovUK.Paragraph>
                    <GovUK.MultiChoice
                      mb={6}
                      hint={t('exportJourney.nationalCode.hint')}
                      label=""
                    >
                      <GovUK.Radio
                        name="hasNationalCode"
                        id="hasNationalCodeYes"
                        checked={
                          nationalCodePage.data.nationalCode?.provided === 'Yes'
                        }
                        onChange={(e) => handleInputChange(e)}
                        value="Yes"
                      >
                        {t('radio.yes')}
                      </GovUK.Radio>
                      {nationalCodePage.data.nationalCode?.provided ===
                        'Yes' && (
                        <ConditionalRadioWrap>
                          <GovUK.InputField
                            input={{
                              name: 'nationalCode',
                              id: 'nationalCode',
                              value:
                                nationalCodePage.data.nationalCode?.value ===
                                undefined
                                  ? ''
                                  : nationalCodePage.data.nationalCode?.value,
                              maxLength: 50,
                              onChange: (e) => handleInputChange(e),
                            }}
                            meta={{
                              error: errors?.nationalCode,
                              touched: !!errors?.nationalCode,
                            }}
                          >
                            {t('exportJourney.nationalCode.inputLabel')}
                          </GovUK.InputField>
                        </ConditionalRadioWrap>
                      )}
                      <GovUK.Radio
                        name="hasNationalCode"
                        id="hasNationalCodeNo"
                        checked={
                          nationalCodePage.data.nationalCode?.provided === 'No'
                        }
                        onChange={(e) => handleInputChange(e)}
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
          </GovUK.GridCol>
        </GovUK.GridRow>
      </GovUK.Page>
    </>
  );
};

export default NationalCode;
NationalCode.auth = true;
