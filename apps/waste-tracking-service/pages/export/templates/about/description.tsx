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
  BreadcrumbWrap,
  TextareaCharCount,
  SubmissionNotFound,
  Loading,
  SaveReturnButton,
  ButtonGroup,
} from 'components';
import { isNotEmpty, validateWasteDescriptionTemplate } from 'utils/validators';
import styled from 'styled-components';
import { getApiConfig } from 'utils/api/apiConfig';
import { PageProps } from 'types/wts';

export const getServerSideProps = async (context) => {
  return getApiConfig(context);
};

type State = {
  data: object;
  isLoading: boolean;
  isError: boolean;
};

type Action = {
  type:
    | 'DATA_FETCH_INIT'
    | 'DATA_FETCH_SUCCESS'
    | 'DATA_FETCH_FAILURE'
    | 'DATA_UPDATE';
  payload?: any;
};

const initialWasteDescState: State = {
  data: null,
  isLoading: true,
  isError: false,
};

const describeWasteReducer = (state: State, action: Action) => {
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

const StyledHeading = styled(GovUK.Heading)`
  margin-bottom: 15px;
`;

const Description = ({ apiConfig }: PageProps) => {
  const { t } = useTranslation();
  const router = useRouter();

  const [describeWastePage, dispatchDescribeWastePage] = useReducer(
    describeWasteReducer,
    initialWasteDescState
  );

  const [templateId, setTemplateId] = useState(null);

  useEffect(() => {
    if (router.isReady) {
      setTemplateId(router.query.templateId);
    }
  }, [router.isReady, router.query.templateId]);

  const [errors, setErrors] = useState<{
    description?: string;
  }>({});

  useEffect(() => {
    const fetchData = async () => {
      dispatchDescribeWastePage({ type: 'DATA_FETCH_INIT' });
      if (templateId !== null) {
        await fetch(
          `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/templates/${templateId}/waste-description`,
          { headers: apiConfig }
        )
          .then((response) => {
            if (response.ok) return response.json();
            else {
              dispatchDescribeWastePage({ type: 'DATA_FETCH_FAILURE' });
            }
          })
          .then((data) => {
            if (data !== undefined) {
              dispatchDescribeWastePage({
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
    dispatchDescribeWastePage({
      type: 'DATA_UPDATE',
      payload: { ...describeWastePage.data, description: input.target.value },
    });
  };

  const whatStatusShouldWeGoTo = (description) => {
    const currentStatus = describeWastePage.data.status;
    let updatedStatus = currentStatus;
    if (currentStatus === 'NotStarted') {
      updatedStatus = 'Started';
    }
    if (currentStatus === 'Started') {
      if (
        describeWastePage.data.wasteCode !== undefined &&
        describeWastePage.data.ewcCodes !== undefined &&
        description
      ) {
        updatedStatus = 'Complete';
      }
    }
    return updatedStatus;
  };

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      const description = describeWastePage.data?.description;
      const newErrors = {
        description: validateWasteDescriptionTemplate(description),
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
              body: JSON.stringify({
                ...describeWastePage.data,
                status: whatStatusShouldWeGoTo(description),
              }),
            }
          )
            .then((response) => {
              if (response.ok) return response.json();
            })
            .then((data) => {
              if (data !== undefined) {
                router.push({
                  pathname: `/export/templates/tasklist`,
                  query: { templateId, context: 'updated' },
                });
              }
            });
        } catch (e) {
          console.error(e);
        }
      }
    },
    [templateId, describeWastePage.data, router]
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
              pathname: `/export/templates/about/national-code`,
              query: { templateId },
            });
          }}
        >
          {t('Back')}
        </GovUK.BackLink>
      </BreadcrumbWrap>
    );
  };

  const Heading = () => {
    return (
      <StyledHeading size="LARGE">
        {t('exportJourney.describeWaste.title')}
      </StyledHeading>
    );
  };

  return (
    <>
      <Head>
        <title>{t('exportJourney.describeWaste.title')}</title>
      </Head>
      <GovUK.Page
        id="content"
        header={<Header />}
        footer={<Footer />}
        beforeChildren={<BreadCrumbs />}
      >
        <GovUK.GridRow>
          <GovUK.GridCol setWidth="two-thirds">
            {describeWastePage.isError && !describeWastePage.isLoading && (
              <SubmissionNotFound />
            )}
            {describeWastePage.isLoading && <Loading />}
            {!describeWastePage.isError && !describeWastePage.isLoading && (
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
                  <GovUK.GridRow>
                    <GovUK.GridCol setWidth="two-thirds">
                      <TextareaCharCount
                        id="description"
                        name="description"
                        hint={t('exportJourney.describeWaste.hint')}
                        onChange={handleInputChange}
                        errorMessage={errors?.description}
                        charCount={100}
                        rows={3}
                        value={describeWastePage.data?.description}
                      >
                        <Heading />
                      </TextareaCharCount>
                    </GovUK.GridCol>
                  </GovUK.GridRow>
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

export default Description;
Description.auth = true;
