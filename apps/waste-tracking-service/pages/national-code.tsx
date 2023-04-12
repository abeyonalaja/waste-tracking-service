import React, { FormEvent, useCallback, useEffect, useState, useReducer, useRef } from 'react';
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
} from '../components';
import { SaveReturnLink } from '../components';
import { validateNationalCode } from '../utils/validators';

function isNotEmpty(obj) {
  return Object.keys(obj).some((key) => obj[key]?.length > 0);
}
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
        data: {...state.data, nationalCode: action.payload}
      }
    default:
      throw new Error();
  }
};

const NationalCode = () => {
  const { t } = useTranslation();
  const router = useRouter();

  const [nationalCodePage, dispatchNationalCodePage] = useReducer(
    nationalCodeReducer,
    { data: {}, isLoading: false, isError: false }
  );

  const id = useRef(null)

  useEffect(() => {
    if (router.isReady) {
      id.current = router.query.id
    }
  }, [router.isReady])

  const [errors, setErrors] = useState<{
    nationalCode?: string;
  }>({});

  useEffect(() => {
    dispatchNationalCodePage({ type: 'DATA_FETCH_INIT' });
    if (id.current !== null) {
        fetch(
          `${process.env.NX_API_GATEWAY_URL}/submissions/${id.current}/waste-description`
        )
          .then((response) => {
            if (response.ok) return response.json();
            else {
              dispatchNationalCodePage({ type: 'DATA_FETCH_FAILURE' });
            }
          })
          .then((data) => {
            if (data !== undefined) {
              dispatchNationalCodePage({
                type: 'DATA_FETCH_SUCCESS',
                payload: data
              });
            }
          });
      }
  }, [router.isReady]);

  const handleInputChange = (input) => {
    let payload
    switch (input.target.name) {
      case 'nationalCode':
        payload = { provided: "Yes", value: input.target.value }
        break;
      case 'hasNationalCode':
        payload = { provided: input.target.value }
        break;
    }
    dispatchNationalCodePage({
      type: 'DATA_UPDATE',
      payload: payload
    });
  }

  const handleLinkSubmit = (e) => {
    handleSubmit(e, true);
  };

  const handleSubmit = useCallback(
    (e: FormEvent, returnToDraft = false) => {

      const nationalCode = nationalCodePage.data.nationalCode?.value
      const hasNationalCode = nationalCodePage.data.nationalCode?.provided

      if (hasNationalCode === undefined) {
        router.push({
          pathname: '/describe-waste',
          query: { id: id.current }
        });
      }

      const newErrors = {
        nationalCode: validateNationalCode(hasNationalCode, nationalCode),
      };

      if (isNotEmpty(newErrors)) {
        setErrors(newErrors);
      } else {
        setErrors(null);
        try {
          fetch(
            `${process.env.NX_API_GATEWAY_URL}/submissions/${id.current}/waste-description`,
            {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(nationalCodePage.data),
            }
          )
            .then((response) => {
              if (response.ok) return response.json();
            })
            .then((data) => {
              if (data !== undefined) {
                const path = returnToDraft
                  ? '/dashboard/submit-an-export'
                  : '/describe-waste';
                router.push({
                  pathname: path,
                  query: { id: id.current }
                });
              }
            });
        } catch (e) {
          console.error(e);
        }
      }

      e.preventDefault();
    },
    [id, nationalCodePage.data]
  );

  const BreadCrumbs = () => {
    return (
      <BreadcrumbWrap>
        <GovUK.BackLink
          href="#"
          onClick={() => {
            router.push({
              pathname: '/dashboard/submit-an-export',
              query: { id: id.current },
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
        <title>{t('exportJourney.nationalCode.title')}</title>
      </Head>
      <GovUK.Page
        id="content"
        header={<CompleteHeader />}
        footer={<CompleteFooter />}
        beforeChildren={<BreadCrumbs />}
      >
        <GovUK.GridRow>
          <GovUK.GridCol setWidth="two-thirds">

            { nationalCodePage.isError && !nationalCodePage.isLoading &&
              <p>No valid record found</p>
            }
            { nationalCodePage.isLoading &&
              <p>Loading</p>
            }
            { !nationalCodePage.isError && !nationalCodePage.isLoading && (
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
                      {t('exportJourney.nationalCode.title')}
                    </GovUK.Fieldset.Legend>
                    <GovUK.Paragraph>
                      {t('exportJourney.nationalCode.intro')}
                    </GovUK.Paragraph>
                    <GovUK.MultiChoice
                      mb={8}
                      hint={t('exportJourney.nationalCode.hint')}
                      label=""
                    >
                      <GovUK.Radio
                        name="hasNationalCode"
                        id="hasNationalCodeYes"
                        checked={nationalCodePage.data.nationalCode?.provided === 'Yes'}
                        onChange={(e) => handleInputChange(e)}
                        value="Yes"
                      >
                        Yes
                      </GovUK.Radio>
                      {nationalCodePage.data.nationalCode?.provided === 'Yes' && (
                        <ConditionalRadioWrap>
                          <GovUK.InputField
                            input={{
                              name: 'nationalCode',
                              id: 'nationalCode',
                              value: nationalCodePage.data.nationalCode?.value === undefined ? "" : nationalCodePage.data.nationalCode?.value,
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
                        checked={nationalCodePage.data.nationalCode?.provided === 'No'}
                        onChange={(e) => handleInputChange(e)}
                        value="No"
                      >
                        No
                      </GovUK.Radio>
                    </GovUK.MultiChoice>
                  </GovUK.Fieldset>
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

export default NationalCode;
