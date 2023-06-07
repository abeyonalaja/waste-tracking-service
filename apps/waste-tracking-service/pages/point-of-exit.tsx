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
  ConditionalRadioWrap,
  BreadcrumbWrap,
  Loading,
  SubmissionNotFound,
  SaveReturnButton,
  ButtonGroup,
} from '../components';
import {
  isNotEmpty,
  validateKnowsPointOfExit,
  validatePointOfExit,
} from '../utils/validators';

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

const PointOfExit = () => {
  const { t } = useTranslation();
  const router = useRouter();

  const [pointOfExitPage, dispatchPointOfExitPage] = useReducer(
    pointOfExitReducer,
    { data: {}, isLoading: true, isError: false }
  );

  const [id, setId] = useState(null);

  useEffect(() => {
    if (router.isReady) {
      setId(router.query.id);
    }
  }, [router.isReady, router.query.id]);

  const [errors, setErrors] = useState<{
    knowsPointOfExit?: string;
    pointOfExit?: string;
  }>({});

  useEffect(() => {
    dispatchPointOfExitPage({ type: 'DATA_FETCH_INIT' });
    if (id !== null) {
      fetch(`${process.env.NX_API_GATEWAY_URL}/submissions/${id}/exit-location`)
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
              payload: data,
            });
          }
        });
    }
  }, [router.isReady, id]);

  const handleInputChange = (input) => {
    let payload;
    switch (input.target.name) {
      case 'pointOfExit':
        payload = {
          status: 'Complete',
          hasExitLocation: true,
          location: input.target.value,
        };
        break;
      case 'knowsPointOfExit':
        payload = {
          status: 'Complete',
          hasExitLocation: input.target.value === 'Yes',
        };
        break;
    }
    dispatchPointOfExitPage({
      type: 'DATA_UPDATE',
      payload: payload,
    });
  };

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      const pointOfExit = pointOfExitPage.data.location;
      const knowsPointOfExit = pointOfExitPage.data.hasExitLocation;

      const newErrors = {
        knowsPointOfExit: validateKnowsPointOfExit(knowsPointOfExit),
        pointOfExit: validatePointOfExit(knowsPointOfExit, pointOfExit),
      };

      if (isNotEmpty(newErrors)) {
        setErrors(newErrors);
      } else {
        setErrors(null);
        try {
          fetch(
            `${process.env.NX_API_GATEWAY_URL}/submissions/${id}/exit-location`,
            {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(pointOfExitPage.data),
            }
          )
            .then((response) => {
              if (response.ok) return response.json();
            })
            .then((data) => {
              if (data !== undefined) {
                router.push({
                  pathname: '/submit-an-export-tasklist',
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
    [id, pointOfExitPage.data, router]
  );

  const BreadCrumbs = () => {
    return (
      <BreadcrumbWrap>
        <GovUK.BackLink
          href="#"
          onClick={() => {
            router.push({
              pathname: '/submit-an-export-tasklist',
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
        <title>{t('exportJourney.pointOfExit.title')}</title>
      </Head>
      <GovUK.Page
        id="content"
        header={<CompleteHeader />}
        footer={<CompleteFooter />}
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
                <GovUK.Caption>
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
                        checked={pointOfExitPage.data.hasExitLocation === true}
                        onChange={(e) => handleInputChange(e)}
                        value="Yes"
                      >
                        {t('radio.yes')}
                      </GovUK.Radio>
                      {pointOfExitPage.data.hasExitLocation && (
                        <ConditionalRadioWrap>
                          <GovUK.InputField
                            input={{
                              name: 'pointOfExit',
                              id: 'pointOfExit',
                              value:
                                pointOfExitPage.data.location !== undefined
                                  ? pointOfExitPage.data.location
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
                        checked={pointOfExitPage.data.hasExitLocation === false}
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
                    <SaveReturnButton onClick={handleSubmit} />
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

export default PointOfExit;
