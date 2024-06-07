import React, { FormEvent, useCallback, useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import * as GovUK from 'govuk-react';

import { useTranslation } from 'react-i18next';
import {
  Footer,
  Header,
  RadiosDivider,
  BreadcrumbWrap,
  ErrorSummary,
  SubmissionNotFound,
  Loading,
  ButtonGroup,
  SaveReturnButton,
} from 'components';
import { GetWasteDescriptionResponse } from '@wts/api/waste-tracking-gateway';
import { isNotEmpty, validateWasteCodeCategory } from 'utils/validators';
import useApiConfig from 'utils/useApiConfig';

const WasteCode = (): React.ReactNode => {
  const { t } = useTranslation();
  const router = useRouter();
  const apiConfig = useApiConfig();
  const [templateId, setTemplateId] = useState<string>(null);
  const [data, setData] = useState<GetWasteDescriptionResponse>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasValidId, setHasValidId] = useState<boolean>(false);
  const [wasteCodeCategory, setWasteCodeCategory] = useState<string>();
  const [code, setCode] = useState<string>();

  const url = `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/templates/${templateId}/waste-description`;

  useEffect(() => {
    if (router.isReady) {
      setTemplateId(String(router.query.templateId));
    }
  }, [router.isReady, router.query.templateId]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setHasValidId(false);
      if (templateId !== null) {
        try {
          await fetch(
            `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/templates/${templateId}/waste-description`,
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
                setWasteCodeCategory(data.wasteCode?.type);
                setCode(data.wasteCode?.code);
                setHasValidId(true);
              }
            });
        } catch (e) {
          console.error(e);
        }
      }
    };
    fetchData();
  }, [router.isReady, templateId]);

  const [errors, setErrors] = useState<{
    wasteCodeCategory?: string;
  }>({});

  const handleCancelReturn = (e) => {
    e.preventDefault();
    router.push({
      pathname: `/templates/tasklist`,
      query: { templateId },
    });
  };

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();

      const newErrors = {
        wasteCodeCategory: validateWasteCodeCategory(wasteCodeCategory),
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
            code: wasteCodeCategory === 'NotApplicable' ? undefined : code,
          },
        };

        try {
          await fetch(url, {
            method: 'PUT',
            headers: apiConfig,
            body: JSON.stringify(body),
          })
            .then((response) => {
              if (response.ok) return response.json();
            })
            .then((data) => {
              if (data !== undefined) {
                router.push({
                  pathname: `/templates/about/${
                    wasteCodeCategory === 'NotApplicable'
                      ? 'ewc-code'
                      : 'waste-code-description'
                  }`,
                  query: { templateId },
                });
              }
            });
        } catch (e) {
          console.error(e);
        }
      }
    },
    [wasteCodeCategory, templateId, router, url, data],
  );

  const BreadCrumbs = () => {
    return (
      <BreadcrumbWrap>
        <GovUK.BackLink
          href="#"
          onClick={() => {
            router.push({
              pathname: `/templates/tasklist`,
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
                <form onSubmit={(e) => handleSubmit(e)}>
                  <GovUK.Fieldset>
                    <GovUK.Fieldset.Legend isPageHeading size="LARGE">
                      {t('exportJourney.whatsTheWasteCode.title')}
                    </GovUK.Fieldset.Legend>
                    <GovUK.MultiChoice
                      mb={6}
                      label=""
                      meta={{
                        error: errors?.wasteCodeCategory,
                        touched: !!errors?.wasteCodeCategory,
                      }}
                    >
                      <GovUK.Radio
                        name="wasteCodeCategory"
                        id="wasteCodeCategoryBaselAnnexIX"
                        checked={wasteCodeCategory === 'BaselAnnexIX'}
                        onChange={() => {
                          setCode('');
                          setWasteCodeCategory('BaselAnnexIX');
                        }}
                      >
                        {t('exportJourney.wasteCode.BaselAnnexIX')}
                      </GovUK.Radio>
                      <GovUK.Radio
                        name="wasteCodeCategory"
                        id="wasteCodeCategoryBaselOECD"
                        checked={wasteCodeCategory === 'OECD'}
                        onChange={() => {
                          setCode('');
                          setWasteCodeCategory('OECD');
                        }}
                      >
                        {t('exportJourney.wasteCode.OECD')}
                      </GovUK.Radio>
                      <GovUK.Radio
                        name="wasteCodeCategory"
                        id="wasteCodeCategoryAnnexIIIA"
                        checked={wasteCodeCategory === 'AnnexIIIA'}
                        onChange={() => {
                          setCode('');
                          setWasteCodeCategory('AnnexIIIA');
                        }}
                      >
                        {t('exportJourney.wasteCode.AnnexIIIA')}
                      </GovUK.Radio>
                      <GovUK.Radio
                        name="wasteCodeCategory"
                        id="wasteCodeCategoryAnnexIIIB"
                        checked={wasteCodeCategory === 'AnnexIIIB'}
                        onChange={() => {
                          setCode('');
                          setWasteCodeCategory('AnnexIIIB');
                        }}
                      >
                        {t('exportJourney.wasteCode.AnnexIIIB')}
                      </GovUK.Radio>
                      <RadiosDivider>
                        {t('exportJourney.quantity.radioDivisor')}
                      </RadiosDivider>
                      <GovUK.Radio
                        name="wasteCodeCategory"
                        id="wasteCodeCategoryNA"
                        hint="Only select this option if the waste is going to a laboratory."
                        checked={wasteCodeCategory === 'NotApplicable'}
                        onChange={() => setWasteCodeCategory('NotApplicable')}
                      >
                        {t('exportJourney.wasteCode.NotApplicable')}
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

export default WasteCode;
WasteCode.auth = true;
