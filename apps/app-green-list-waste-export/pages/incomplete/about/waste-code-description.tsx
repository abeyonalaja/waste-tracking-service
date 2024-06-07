import React, { FormEvent, useCallback, useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import * as GovUK from 'govuk-react';

import { useTranslation } from 'react-i18next';
import useApiConfig from 'utils/useApiConfig';
import {
  AppLink,
  AutoComplete,
  BreadcrumbWrap,
  ButtonGroup,
  ErrorSummary,
  Footer,
  Header,
  Loading,
  Paragraph,
  SaveReturnButton,
  SubmissionNotFound,
} from 'components';
import { isNotEmpty, validateWasteCode } from 'utils/validators';
import { GetWasteDescriptionResponse } from '@wts/api/waste-tracking-gateway';
interface singleCodeType {
  code: string;
  value: {
    description: any;
  };
}

interface codeType {
  type: string;
  values: Array<singleCodeType>;
}
const WasteCodeDesc = (): React.ReactNode => {
  const { t } = useTranslation();
  const router = useRouter();
  const [id, setId] = useState<string | string[]>(null);
  const [data, setData] = useState<GetWasteDescriptionResponse>();
  const [refData, setRefData] = useState<Array<codeType>>();
  const [dataLoaded, setDataLoaded] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [wasteCodeCategory, setWasteCodeCategory] = useState<string>(null);
  const [wasteCodeCategoryWithSpaces, setWasteCodeCategoryWithSpaces] =
    useState<string>('');
  const [code, setCode] = useState<string>(undefined);
  const [hasValidId, setHasValidId] = useState<boolean>(false);
  const apiConfig = useApiConfig();
  const url = `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/submissions/${id}/waste-description`;

  useEffect(() => {
    const fetchData = async () => {
      if (wasteCodeCategory !== undefined) {
        try {
          await fetch(
            `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/reference-data/waste-codes`,
            { headers: apiConfig },
          )
            .then((response) => {
              if (response.ok) return response.json();
            })
            .then((refdata) => {
              if (refdata !== undefined) {
                setRefData(refdata);
                setDataLoaded(true);
              }
            });
        } catch (e) {
          console.error(e);
        }
      }
    };
    fetchData();
  }, [router.isReady]);

  useEffect(() => {
    if (router.isReady) {
      setId(router.query.id);
    }
  }, [router.isReady, router.query.id]);

  useEffect(() => {
    setIsLoading(true);
    setHasValidId(false);
    const fetchData = async () => {
      if (id !== null) {
        try {
          await fetch(
            `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/submissions/${id}/waste-description`,
            { headers: apiConfig },
          )
            .then((response) => {
              setIsLoading(false);
              if (response.ok) return response.json();
              else {
                setHasValidId(false);
              }
            })
            .then((data) => {
              if (data !== undefined) {
                setData(data);
                setCode(data.wasteCode?.code);
                setWasteCodeCategory(data.wasteCode?.type);
                setWasteCodeCategoryWithSpaces(
                  getCodeCategoryName(data.wasteCode?.type),
                );
                setHasValidId(true);
              }
            });
        } catch (e) {
          console.error(e);
        }
      }
    };
    fetchData();
  }, [router.isReady, id]);

  const getRefData = (type: string) => {
    const filterData = refData.find((options) => options.type === type);
    return filterData.values;
  };

  const [errors, setErrors] = useState<{
    code?: string;
  }>({});
  const handleLinkSubmit = (e) => {
    handleSubmit(e, true);
  };
  function getCodeCategoryName(wasteCodeCategory: string) {
    if (wasteCodeCategory === 'BaselAnnexIX') {
      return t('exportJourney.wasteCode.BaselAnnexIX');
    } else if (wasteCodeCategory === 'OECD') {
      return t('exportJourney.wasteCode.OECD');
    } else if (wasteCodeCategory === 'AnnexIIIA') {
      return t('exportJourney.wasteCode.AnnexIIIA');
    } else if (wasteCodeCategory === 'AnnexIIIB') {
      return t('exportJourney.wasteCode.AnnexIIIB');
    }
  }
  const handleSubmit = useCallback(
    async (e: FormEvent, returnToDraft) => {
      e.preventDefault();

      const newErrors = {
        code: validateWasteCode(
          wasteCodeCategory,
          code,
          getCodeCategoryName(wasteCodeCategory),
        ),
      };
      if (isNotEmpty(newErrors)) {
        setErrors(newErrors);
      } else {
        setErrors(null);

        const body = {
          ...data,
          status: 'Started',
          wasteCode: {
            type: wasteCodeCategory,
            code: code,
          },
        };
        try {
          fetch(url, {
            method: 'PUT',
            headers: apiConfig,
            body: JSON.stringify(body),
          })
            .then((response) => {
              if (response.ok) return response.json();
            })
            .then((data) => {
              if (data !== undefined) {
                const path = returnToDraft
                  ? `/incomplete/tasklist`
                  : `/incomplete/about/ewc-code`;
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
    [wasteCodeCategory, code, id, router, url, data],
  );
  const BreadCrumbs = () => {
    return (
      <BreadcrumbWrap>
        <GovUK.BackLink
          href="#"
          onClick={() => {
            router.push({
              pathname: router.query.dashboard
                ? `/incomplete/tasklist`
                : `/incomplete/about/waste-code`,
              query: { id },
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
        <title>{t('exportJourney.whatsTheWasteCode.title')}</title>
      </Head>
      <GovUK.Page
        id="content"
        header={<Header />}
        footer={<Footer />}
        beforeChildren={<BreadCrumbs />}
      >
        <GovUK.GridRow>
          <GovUK.GridCol setWidth="two-thirds">
            {isLoading && <Loading />}
            {!isLoading && !hasValidId && <SubmissionNotFound />}
            {!isLoading && hasValidId && (
              <>
                {errors && !!Object.keys(errors).length && (
                  <ErrorSummary
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
                <form onSubmit={(e) => handleSubmit(e, false)}>
                  <GovUK.Label htmlFor={'WasteCode'}>
                    <GovUK.Heading size={'L'}>
                      {t('exportJourney.wasteCodesDescription.title', {
                        wc: wasteCodeCategoryWithSpaces,
                      })}
                    </GovUK.Heading>
                  </GovUK.Label>
                  <Paragraph>
                    {t('exportJourney.wasteCodesDescription.paragraph')}
                    <AppLink
                      href="https://www.gov.uk/government/publications/waste-classification-technical-guidance"
                      target="_blank"
                    >
                      {t('exportJourney.wasteCodesDescription.link')}
                    </AppLink>
                    .
                  </Paragraph>
                  <GovUK.MultiChoice
                    mb={6}
                    label=""
                    meta={{
                      error: errors?.code,
                      touched: !!errors?.code,
                    }}
                  >
                    <GovUK.HintText>{t('autocompleteHint')}</GovUK.HintText>
                    {wasteCodeCategory && dataLoaded && (
                      <AutoComplete
                        id={'WasteCode'}
                        name={'wasteCode'}
                        options={getRefData(wasteCodeCategory)}
                        value={code ? code : undefined}
                        confirm={(o) => setCode(o.code)}
                      />
                    )}
                  </GovUK.MultiChoice>
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

export default WasteCodeDesc;
WasteCodeDesc.auth = true;
