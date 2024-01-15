import React, { FormEvent, useCallback, useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import * as GovUK from 'govuk-react';

import { useTranslation } from 'react-i18next';
import {
  Footer,
  Header,
  ConditionalRadioWrap,
  RadiosDivider,
  BreadcrumbWrap,
  SubmissionNotFound,
  Loading,
  ButtonGroup,
  SaveReturnButton,
  AutoComplete,
} from 'components';
import {
  isNotEmpty,
  validateWasteCode,
  validateWasteCodeCategory,
} from 'utils/validators';
import {
  GetWasteDescriptionResponse,
  PutWasteDescriptionRequest,
} from '@wts/api/waste-tracking-gateway';
import { getApiConfig } from 'utils/api/apiConfig';
import { PageProps } from 'types/wts';

export const getServerSideProps = async (context) => {
  return getApiConfig(context);
};

type singleCodeType = {
  code: string;
  value: {
    description: any;
  };
};

type codeType = {
  type: string;
  values: Array<singleCodeType>;
};

const WasteCode = ({ apiConfig }: PageProps) => {
  const { t } = useTranslation();
  const router = useRouter();
  const [id, setId] = useState<string | string[]>(null);
  const [data, setData] = useState<GetWasteDescriptionResponse>();
  const [refData, setRefData] = useState<Array<codeType>>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasValidId, setHasValidId] = useState<boolean>(false);
  const [wasteCodeCategory, setWasteCodeCategory] = useState<string>(null);
  const [baselAnnexIXCode, setBaselAnnexIXCode] = useState<string>();
  const [oecdCode, setOecdCode] = useState<string>();
  const [annexIIIACode, setAnnexIIIACode] = useState<string>();
  const [annexIIIBCode, setAnnexIIIBCode] = useState<string>();
  const [isBulkOrSmall, setIsBulkOrSmall] = useState<string>();

  const url = `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/submissions/${id}/waste-description`;

  useEffect(() => {
    const fetchData = async () => {
      if (data !== undefined) {
        try {
          await fetch(
            `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/reference-data/waste-codes`,
            { headers: apiConfig }
          )
            .then((response) => {
              if (response.ok) return response.json();
            })
            .then((refdata) => {
              if (refdata !== undefined) {
                setRefData(refdata);
              }
            });
        } catch (e) {
          console.error(e);
        }
      }
    };
    fetchData();
  }, [wasteCodeCategory]);

  useEffect(() => {
    if (data !== undefined && refData !== undefined) {
      if (
        data.status !== 'NotStarted' &&
        data.wasteCode.type !== 'NotApplicable'
      ) {
        setWasteCode(data.wasteCode?.type, data.wasteCode?.code);
      }
      setIsLoading(false);
    }
  }, [data, refData]);

  const setWasteCode = (category, code) => {
    if (category === 'BaselAnnexIX') setBaselAnnexIXCode(code);
    if (category === 'OECD') setOecdCode(code);
    if (category === 'AnnexIIIA') setAnnexIIIACode(code);
    if (category === 'AnnexIIIB') setAnnexIIIBCode(code);
  };

  const getWasteCodeType = (category) => {
    if (category !== undefined) {
      if (category === 'NotApplicable') {
        return 'Small';
      } else {
        return 'Bulk';
      }
    }
    return null;
  };

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
            { headers: apiConfig }
          )
            .then((response) => {
              if (response.ok) return response.json();
              else {
                setHasValidId(false);
                setIsLoading(false);
              }
            })
            .then((data) => {
              if (data !== undefined) {
                setData(data);
                setWasteCodeCategory(data.wasteCode?.type);
                setIsBulkOrSmall(getWasteCodeType(data.wasteCode?.type));
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

  const [errors, setErrors] = useState<{
    wasteCodeCategory?: string;
    baselAnnexIXCode?: string;
    oecdCode?: string;
    annexIIIACode?: string;
    annexIIIBCode?: string;
  }>({});

  const handleLinkSubmit = (e) => {
    handleSubmit(e, true);
  };

  const handleSubmit = useCallback(
    async (e: FormEvent, returnToDraft) => {
      e.preventDefault();
      const getWasteCode = () => {
        if (wasteCodeCategory === 'BaselAnnexIX') return baselAnnexIXCode;
        if (wasteCodeCategory === 'OECD') return oecdCode;
        if (wasteCodeCategory === 'AnnexIIIA') return annexIIIACode;
        if (wasteCodeCategory === 'AnnexIIIB') return annexIIIBCode;
        return undefined;
      };

      const newErrors = {
        wasteCodeCategory: validateWasteCodeCategory(wasteCodeCategory),
        baselAnnexIXCode: validateWasteCode(
          wasteCodeCategory,
          baselAnnexIXCode,
          'Basel Annex IX'
        ),
        oecdCode: validateWasteCode(wasteCodeCategory, oecdCode, 'OECD'),
        annexIIIACode: validateWasteCode(
          wasteCodeCategory,
          annexIIIACode,
          'Annex IIIA'
        ),
        annexIIIBCode: validateWasteCode(
          wasteCodeCategory,
          annexIIIBCode,
          'Annex IIIB'
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
            code: getWasteCode(),
          },
        };

        if (isBulkOrSmall !== null) {
          const submittedWasteCodeType = getWasteCodeType(wasteCodeCategory);
          if (isBulkOrSmall !== submittedWasteCodeType) {
            try {
              const data: PutWasteDescriptionRequest = { status: 'NotStarted' };
              await fetch(
                `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/submissions/${id}/waste-quantity`,
                {
                  method: 'PUT',
                  headers: apiConfig,
                  body: JSON.stringify(data),
                }
              );
            } catch (e) {
              console.error(e);
            }
          }
        }

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
                  ? `/export/incomplete/tasklist`
                  : `/export/incomplete/about/ewc-code`;
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
    [
      wasteCodeCategory,
      baselAnnexIXCode,
      oecdCode,
      annexIIIACode,
      annexIIIBCode,
      id,
      router,
      url,
      data,
    ]
  );

  const BreadCrumbs = () => {
    return (
      <BreadcrumbWrap>
        <GovUK.BackLink
          href="#"
          onClick={() => {
            router.push({
              pathname: `/export/incomplete/tasklist`,
              query: { id },
            });
          }}
        >
          {t('Back')}
        </GovUK.BackLink>
      </BreadcrumbWrap>
    );
  };

  const getRefData = (type: string) => {
    const filterData = refData.find((options) => options.type === type);
    return filterData.values;
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
                <form onSubmit={(e) => handleSubmit(e, false)}>
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
                        onChange={() => setWasteCodeCategory('BaselAnnexIX')}
                      >
                        Basel Annex IX
                      </GovUK.Radio>
                      {wasteCodeCategory === 'BaselAnnexIX' && (
                        <ConditionalRadioWrap>
                          <GovUK.FormGroup error={!!errors?.baselAnnexIXCode}>
                            <GovUK.VisuallyHidden>
                              <GovUK.Label htmlFor="BaselAnnexIXCode">
                                Basel Annex IX code
                              </GovUK.Label>
                            </GovUK.VisuallyHidden>
                            <GovUK.HintText>
                              {t('autocompleteHint')}
                            </GovUK.HintText>
                            <GovUK.ErrorText>
                              {errors?.baselAnnexIXCode}
                            </GovUK.ErrorText>
                            <AutoComplete
                              id={'BaselAnnexIXCode'}
                              options={getRefData('BaselAnnexIX')}
                              value={baselAnnexIXCode}
                              confirm={(o) => setBaselAnnexIXCode(o.code)}
                            />
                          </GovUK.FormGroup>
                        </ConditionalRadioWrap>
                      )}
                      <GovUK.Radio
                        name="wasteCodeCategory"
                        id="wasteCodeCategoryBaselOECD"
                        checked={wasteCodeCategory === 'OECD'}
                        onChange={() => setWasteCodeCategory('OECD')}
                      >
                        OECD
                      </GovUK.Radio>
                      {wasteCodeCategory === 'OECD' && (
                        <ConditionalRadioWrap>
                          <GovUK.FormGroup error={!!errors?.oecdCode}>
                            <GovUK.VisuallyHidden>
                              <GovUK.Label htmlFor="OecdCode">
                                OECD code
                              </GovUK.Label>
                            </GovUK.VisuallyHidden>
                            <GovUK.HintText>
                              {t('autocompleteHint')}
                            </GovUK.HintText>
                            <GovUK.ErrorText>
                              {errors?.oecdCode}
                            </GovUK.ErrorText>
                            <AutoComplete
                              id={'OecdCode'}
                              options={getRefData('OECD')}
                              value={oecdCode}
                              confirm={(o) => setOecdCode(o.code)}
                            />
                          </GovUK.FormGroup>
                        </ConditionalRadioWrap>
                      )}
                      <GovUK.Radio
                        name="wasteCodeCategory"
                        id="wasteCodeCategoryAnnexIIIA"
                        checked={wasteCodeCategory === 'AnnexIIIA'}
                        onChange={() => setWasteCodeCategory('AnnexIIIA')}
                      >
                        Annex IIIA
                      </GovUK.Radio>
                      {wasteCodeCategory === 'AnnexIIIA' && (
                        <ConditionalRadioWrap>
                          <GovUK.FormGroup error={!!errors?.annexIIIACode}>
                            <GovUK.VisuallyHidden>
                              <GovUK.Label htmlFor="AnnexIIIACode">
                                Annex IIIA code
                              </GovUK.Label>
                            </GovUK.VisuallyHidden>
                            <GovUK.HintText>
                              {t('autocompleteHint')}
                            </GovUK.HintText>
                            <GovUK.ErrorText>
                              {errors?.annexIIIACode}
                            </GovUK.ErrorText>
                            <AutoComplete
                              id={'AnnexIIIACode'}
                              options={getRefData('AnnexIIIA')}
                              value={annexIIIACode}
                              confirm={(o) => setAnnexIIIACode(o.code)}
                            />
                          </GovUK.FormGroup>
                        </ConditionalRadioWrap>
                      )}
                      <GovUK.Radio
                        name="wasteCodeCategory"
                        id="wasteCodeCategoryAnnexIIIB"
                        checked={wasteCodeCategory === 'AnnexIIIB'}
                        onChange={() => setWasteCodeCategory('AnnexIIIB')}
                      >
                        Annex IIIB
                      </GovUK.Radio>
                      {wasteCodeCategory === 'AnnexIIIB' && (
                        <ConditionalRadioWrap>
                          <GovUK.FormGroup error={!!errors?.annexIIIBCode}>
                            <GovUK.VisuallyHidden>
                              <GovUK.Label htmlFor="AnnexIIIBCode">
                                Annex IIIB code
                              </GovUK.Label>
                            </GovUK.VisuallyHidden>
                            <GovUK.HintText>
                              {t('autocompleteHint')}
                            </GovUK.HintText>
                            <GovUK.ErrorText>
                              {errors?.annexIIIBCode}
                            </GovUK.ErrorText>
                            <AutoComplete
                              id={'AnnexIIIBCode'}
                              options={getRefData('AnnexIIIB')}
                              value={annexIIIBCode}
                              confirm={(o) => setAnnexIIIBCode(o.code)}
                            />
                          </GovUK.FormGroup>
                        </ConditionalRadioWrap>
                      )}
                      <RadiosDivider>or</RadiosDivider>
                      <GovUK.Radio
                        name="wasteCodeCategory"
                        id="wasteCodeCategoryNA"
                        hint="Only select this option if the waste is going to a laboratory."
                        checked={wasteCodeCategory === 'NotApplicable'}
                        onChange={() => setWasteCodeCategory('NotApplicable')}
                      >
                        Not applicable
                      </GovUK.Radio>
                    </GovUK.MultiChoice>
                  </GovUK.Fieldset>
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

export default WasteCode;
WasteCode.auth = true;
