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
import { isNotEmpty, validateWasteDescription } from 'utils/validators';
import styled from 'styled-components';

import { GetWasteDescriptionResponse } from '@wts/api/waste-tracking-gateway';
import useApiConfig from 'utils/useApiConfig';

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

const initialWasteDescState: State = {
  data: { status: 'Started' },
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

const Description = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const apiConfig = useApiConfig();

  const [describeWastePage, dispatchDescribeWastePage] = useReducer(
    describeWasteReducer,
    initialWasteDescState
  );

  const [id, setId] = useState(null);

  useEffect(() => {
    if (router.isReady) {
      setId(router.query.id);
    }
  }, [router.isReady, router.query.id]);

  const [errors, setErrors] = useState<{
    description?: string;
  }>({});

  useEffect(() => {
    const fetchData = async () => {
      dispatchDescribeWastePage({ type: 'DATA_FETCH_INIT' });
      if (id !== null) {
        fetch(
          `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/submissions/${id}/waste-description`,
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
  }, [router.isReady, id]);

  const handleInputChange = (input) => {
    dispatchDescribeWastePage({
      type: 'DATA_UPDATE',
      payload: { ...describeWastePage.data, description: input.target.value },
    });
  };

  const handleLinkSubmit = async (e) => {
    await handleSubmit(e, true);
  };

  const handleSubmit = useCallback(
    async (e: FormEvent, returnToDraft = false) => {
      e.preventDefault();
      const description = describeWastePage.data?.description;
      const newErrors = {
        description: validateWasteDescription(description),
      };

      if (isNotEmpty(newErrors)) {
        setErrors(newErrors);
      } else {
        setErrors(null);
        try {
          await fetch(
            `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/submissions/${id}/waste-description`,
            {
              method: 'PUT',
              headers: apiConfig,
              body: JSON.stringify({
                ...describeWastePage.data,
                status: 'Complete',
              }),
            }
          )
            .then((response) => {
              if (response.ok) return response.json();
            })
            .then((data) => {
              if (data !== undefined) {
                const path = returnToDraft
                  ? `/export/incomplete/tasklist`
                  : `/export/incomplete/about/quantity`;
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
    },
    [id, describeWastePage.data, router]
  );

  const BreadCrumbs = () => {
    return (
      <BreadcrumbWrap>
        <GovUK.BackLink
          href="#"
          onClick={() => {
            router.push({
              pathname: `/export/incomplete/about/national-code`,
              query: { id },
            });
          }}
        >
          Back
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

export default Description;
Description.auth = true;
