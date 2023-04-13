import React, {
  FormEvent,
  useCallback,
  useEffect,
  useState,
  useReducer
} from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import * as GovUK from 'govuk-react';
import '../i18n/config';
import { useTranslation } from 'react-i18next';
import {
  CompleteFooter,
  CompleteHeader,
  BreadcrumbWrap,
  TextareaCharCount,
  SaveReturnLink,
} from '../components';
import { validateWasteDescription } from '../utils/validators';
import styled from 'styled-components';

import {
  GetWasteDescriptionResponse,
} from '@wts/api/waste-tracking-gateway';

function isNotEmpty(obj) {
  return Object.keys(obj).some((key) => obj[key]?.length > 0);
}

type State = {
  data: GetWasteDescriptionResponse,
  isLoading: boolean,
  isError: boolean
}

type Action =
  | { type: 'DATA_FETCH_INIT' }
  | { type: 'DATA_FETCH_SUCCESS' }
  | { type: 'DATA_FETCH_FAILURE' }
  | { type: 'DATA_UPDATE' };

const initialWasteDescState: State = {
  data: { status: 'Started' },
  isLoading: false,
  isError: false
}

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
        data: { ...state.data, status: 'Started', description: action.payload },
      };
    default:
      throw new Error();
  }
};

const StyledHeading = styled(GovUK.Heading)`
  margin-bottom: 15px;
`;

const DescribeWaste = () => {
  const { t } = useTranslation();
  const router = useRouter();

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
    dispatchDescribeWastePage({ type: 'DATA_FETCH_INIT' });
    if (id !== null) {
      fetch(
        `${process.env.NX_API_GATEWAY_URL}/submissions/${id}/waste-description`
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
  }, [router.isReady, id]);

  const handleInputChange = (input) => {
    dispatchDescribeWastePage({
      type: 'DATA_UPDATE',
      payload: input.target.value,
    });
  };

  const handleLinkSubmit = (e) => {
    handleSubmit(e, true);
  };

  const handleSubmit = useCallback(
    (e: FormEvent, returnToDraft = false) => {
      const description = describeWastePage.data?.description;

      const newErrors = {
        description: validateWasteDescription(description),
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
              body: JSON.stringify(describeWastePage.data),
            }
          )
            .then((response) => {
              if (response.ok) return response.json();
            })
            .then((data) => {
              if (data !== undefined) {
                const path = returnToDraft
                  ? '/dashboard/submit-an-export'
                  : '/quantity';
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
    [id, describeWastePage.data, router]
  );

  const BreadCrumbs = () => {
    return (
      <BreadcrumbWrap>
        <GovUK.BackLink
          href="#"
          onClick={() => {
            router.push({
              pathname: '/national-code',
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
        header={<CompleteHeader />}
        footer={<CompleteFooter />}
        beforeChildren={<BreadCrumbs />}
      >
        <GovUK.GridRow>
          <GovUK.GridCol setWidth="two-thirds">
            {describeWastePage.isError && !describeWastePage.isLoading && (
              <p>No valid record found</p>
            )}
            {describeWastePage.isLoading && <p>Loading</p>}
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
                <form onSubmit={handleSubmit}>
                  <TextareaCharCount
                    id="description"
                    name="description"
                    hint={t('exportJourney.describeWaste.hint')}
                    onChange={handleInputChange}
                    errorMessage={errors?.description}
                    charCount={100}
                    value={describeWastePage.data?.description}
                  >
                    <Heading />
                  </TextareaCharCount>
                  <GovUK.Button id="saveButton">{t('saveButton')}</GovUK.Button>
                  <SaveReturnLink callBack={handleLinkSubmit} />
                </form>
              </>
            )}
          </GovUK.GridCol>
        </GovUK.GridRow>
      </GovUK.Page>
    </>
  );
};

export default DescribeWaste;
