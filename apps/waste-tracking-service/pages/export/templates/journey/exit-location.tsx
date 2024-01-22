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
import {
  isNotEmpty,
  validateKnowsPointOfExit,
  validatePointOfExit,
} from 'utils/validators';
import useApiConfig from 'utils/useApiConfig';

const pointOfExitReducer = (state, action) => {
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

const ExitLocation = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const apiConfig = useApiConfig();

  const [pointOfExitPage, dispatchPointOfExitPage] = useReducer(
    pointOfExitReducer,
    { data: null, isLoading: true, isError: false }
  );

  const [templateId, setTemplateId] = useState(null);

  useEffect(() => {
    if (router.isReady) {
      setTemplateId(router.query.templateId);
    }
  }, [router.isReady, router.query.templateId]);

  const [errors, setErrors] = useState<{
    knowsPointOfExit?: string;
    pointOfExit?: string;
  }>({});

  useEffect(() => {
    const fetchData = async () => {
      dispatchPointOfExitPage({ type: 'DATA_FETCH_INIT' });
      if (templateId !== null) {
        await fetch(
          `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/templates/${templateId}/exit-location`,
          { headers: apiConfig }
        )
          .then((response) => {
            if (response.ok) return response.json();
            else {
              dispatchPointOfExitPage({ type: 'DATA_FETCH_FAILURE' });
            }
          })
          .then((data) => {
            if (data !== undefined) {
              dispatchPointOfExitPage({
                type: 'DATA_FETCH_SUCCESS',
                payload: data.exitLocation,
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
      case 'pointOfExit':
        payload = {
          provided: 'Yes',
          value: input.target.value,
        };
        break;
      case 'knowsPointOfExit':
        payload = {
          provided: input.target.value,
        };
        break;
    }
    dispatchPointOfExitPage({
      type: 'DATA_UPDATE',
      payload: payload,
    });
  };

  const handleSubmit = useCallback(
    async (e: FormEvent, returnToDraft = false) => {
      e.preventDefault();
      const pointOfExit = pointOfExitPage.data?.value;
      const knowsPointOfExit = pointOfExitPage.data?.provided;

      const newErrors = {
        knowsPointOfExit: validateKnowsPointOfExit(knowsPointOfExit),
        pointOfExit: validatePointOfExit(knowsPointOfExit, pointOfExit),
      };

      if (isNotEmpty(newErrors)) {
        setErrors(newErrors);
      } else {
        setErrors(null);

        try {
          await fetch(
            `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/templates/${templateId}/exit-location`,
            {
              method: 'PUT',
              headers: apiConfig,
              body: JSON.stringify({
                status: 'Complete',
                exitLocation: pointOfExitPage.data,
              }),
            }
          )
            .then((response) => {
              if (response.ok) return response.json();
            })
            .then((data) => {
              if (data !== undefined) {
                const path = returnToDraft
                  ? `/export/templates/tasklist`
                  : `/export/templates/journey/transit-countries`;
                router.push({
                  pathname: path,
                  query: { templateId },
                });
              }
            });
        } catch (e) {
          console.error(e);
        }
      }
    },
    [templateId, pointOfExitPage.data, router]
  );

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
            router.push({
              pathname: `/export/templates/tasklist`,
              query: { templateId },
            });
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
        <title>{t('exportJourney.pointOfExit.title')}</title>
      </Head>
      <GovUK.Page
        id="content"
        header={<Header />}
        footer={<Footer />}
        beforeChildren={<BreadCrumbs />}
      >
        <GovUK.GridRow>
          <GovUK.GridCol setWidth="two-thirds">
            {pointOfExitPage.isError && !pointOfExitPage.isLoading && (
              <SubmissionNotFound />
            )}
            {pointOfExitPage.isLoading && <Loading />}
            {!pointOfExitPage.isError && !pointOfExitPage.isLoading && (
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
                  {t('exportJourney.pointOfExit.caption')}
                </GovUK.Caption>
                <form onSubmit={handleSubmit}>
                  <GovUK.Fieldset>
                    <GovUK.Fieldset.Legend isPageHeading size="LARGE">
                      {t('exportJourney.pointOfExit.title')}
                    </GovUK.Fieldset.Legend>
                    <GovUK.Paragraph>
                      {t('exportJourney.pointOfExit.intro')}
                    </GovUK.Paragraph>
                    <GovUK.MultiChoice
                      mb={6}
                      label=""
                      meta={{
                        error: errors?.knowsPointOfExit,
                        touched: !!errors?.knowsPointOfExit,
                      }}
                    >
                      <GovUK.Radio
                        name="knowsPointOfExit"
                        id="knowsPointOfExitYes"
                        checked={pointOfExitPage.data?.provided === 'Yes'}
                        onChange={(e) => handleInputChange(e)}
                        value="Yes"
                      >
                        {t('radio.yes')}
                      </GovUK.Radio>
                      {pointOfExitPage.data?.provided === 'Yes' && (
                        <ConditionalRadioWrap>
                          <GovUK.InputField
                            input={{
                              name: 'pointOfExit',
                              id: 'pointOfExit',
                              value:
                                pointOfExitPage.data.value !== undefined
                                  ? pointOfExitPage.data.value
                                  : '',
                              maxLength: 50,
                              onChange: (e) => handleInputChange(e),
                            }}
                            meta={{
                              error: errors?.pointOfExit,
                              touched: !!errors?.pointOfExit,
                            }}
                          >
                            {t('exportJourney.pointOfExit.inputLabel')}
                          </GovUK.InputField>
                        </ConditionalRadioWrap>
                      )}
                      <GovUK.Radio
                        name="knowsPointOfExit"
                        id="knowsPointOfExitNo"
                        checked={pointOfExitPage.data?.provided === 'No'}
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

export default ExitLocation;
ExitLocation.auth = true;
