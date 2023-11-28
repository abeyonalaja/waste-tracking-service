import React, { FormEvent, useCallback, useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import * as GovUK from 'govuk-react';

import { useTranslation } from 'react-i18next';
import {
  CompleteFooter,
  CompleteHeader,
  ConditionalRadioWrap,
  RadiosDivider,
  BreadcrumbWrap,
  SubmissionNotFound,
  Loading,
  ButtonGroup,
  SaveReturnButton,
} from 'components';
import { GetWasteDescriptionResponse } from '@wts/api/waste-tracking-gateway';
import {
  isNotEmpty,
  validateWasteCode,
  validateWasteCodeCategory,
} from 'utils/validators';
import Autocomplete from 'accessible-autocomplete/react';

import i18n from 'i18next';

type singleCodeType = {
  code: string;
  description: string;
};

type codeType = {
  type: string;
  values: Array<singleCodeType>;
};

const WasteCode = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [templateId, setTemplateId] = useState<string>(null);
  const [data, setData] = useState<GetWasteDescriptionResponse>();
  const [refData, setRefData] = useState<Array<codeType>>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasValidId, setHasValidId] = useState<boolean>(false);
  const [wasteCodeCategory, setWasteCodeCategory] = useState<string>();
  const [baselAnnexIXCode, setBaselAnnexIXCode] = useState<singleCodeType>();
  const [oecdCode, setOecdCode] = useState<singleCodeType>();
  const [annexIIIACode, setAnnexIIIACode] = useState<singleCodeType>();
  const [annexIIIBCode, setAnnexIIIBCode] = useState<singleCodeType>();

  const url = `${process.env.NX_API_GATEWAY_URL}/templates/${templateId}/waste-description`;
  const currentLanguage = i18n.language;

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetch(
          `${process.env.NX_API_GATEWAY_URL}/wts-info/waste-codes?language=${currentLanguage}`
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
    };
    if (currentLanguage) {
      fetchData();
    }
  }, [currentLanguage, wasteCodeCategory]);

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
    const codeObject = {
      code: code,
      description: getWasteCodeDescription(category, code),
    };
    if (category === 'BaselAnnexIX') setBaselAnnexIXCode(codeObject);
    if (category === 'OECD') setOecdCode(codeObject);
    if (category === 'AnnexIIIA') setAnnexIIIACode(codeObject);
    if (category === 'AnnexIIIB') setAnnexIIIBCode(codeObject);
  };

  const getWasteCodeDescription = (category, code) => {
    if (refData !== undefined) {
      const results = refData.find((codeTypes) => codeTypes.type === category);
      const result = results.values.find((result) => result.code === code);
      return result.description;
    } else {
      return '';
    }
  };

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
            `${process.env.NX_API_GATEWAY_URL}/templates/${templateId}/waste-description`
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
    baselAnnexIXCode?: string;
    oecdCode?: string;
    annexIIIACode?: string;
    annexIIIBCode?: string;
  }>({});

  function suggest(query, populateResults) {
    const searchTerm = query.split(':')[0].toLowerCase();
    const results = refData.find((codeTypes: codeType) => {
      return codeTypes.type === wasteCodeCategory;
    });
    const filterResults = (result) => {
      const tempString = `${result.code}: ${result.description}`;
      return tempString.toLowerCase().indexOf(searchTerm) !== -1;
    };
    const filteredResults = results.values.filter(filterResults);
    populateResults(filteredResults);
  }

  const suggestionTemplate = (suggestion) => {
    return typeof suggestion !== 'string'
      ? `${suggestion?.code}: ${suggestion?.description}`
      : suggestion;
  };

  const inputValueTemplate = (suggestion) => {
    return `${suggestion?.code}: ${suggestion?.description}`;
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
      const getWasteCode = () => {
        if (wasteCodeCategory === 'BaselAnnexIX') return baselAnnexIXCode.code;
        if (wasteCodeCategory === 'OECD') return oecdCode.code;
        if (wasteCodeCategory === 'AnnexIIIA') return annexIIIACode.code;
        if (wasteCodeCategory === 'AnnexIIIB') return annexIIIBCode.code;
        return undefined;
      };

      const newErrors = {
        wasteCodeCategory: validateWasteCodeCategory(wasteCodeCategory),
        baselAnnexIXCode: validateWasteCode(
          wasteCodeCategory,
          baselAnnexIXCode?.code,
          'Basel Annex IX'
        ),
        oecdCode: validateWasteCode(wasteCodeCategory, oecdCode?.code, 'OECD'),
        annexIIIACode: validateWasteCode(
          wasteCodeCategory,
          annexIIIACode?.code,
          'Annex IIIA'
        ),
        annexIIIBCode: validateWasteCode(
          wasteCodeCategory,
          annexIIIBCode?.code,
          'Annex IIIB'
        ),
      };
      if (isNotEmpty(newErrors)) {
        setErrors(newErrors);
      } else {
        setErrors(null);

        if (wasteCodeCategory !== undefined) {
          const body = {
            ...data,
            status: 'Started',
            wasteCode: {
              type: wasteCodeCategory,
              code: getWasteCode(),
            },
          };

          try {
            await fetch(url, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(body),
            })
              .then((response) => {
                if (response.ok) return response.json();
              })
              .then((data) => {
                if (data !== undefined) {
                  router.push({
                    pathname: `/export/templates/about/ewc-code`,
                    query: { templateId },
                  });
                }
              });
          } catch (e) {
            console.error(e);
          }
        } else {
          router.push({
            pathname: `/export/templates/about/ewc-code`,
            query: { templateId },
          });
        }
      }
    },
    [
      wasteCodeCategory,
      baselAnnexIXCode,
      oecdCode,
      annexIIIACode,
      annexIIIBCode,
      templateId,
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
              pathname: `/export/templates/tasklist`,
              query: { templateId },
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
        <title>{t('exportJourney.whatsTheWasteCode.title')}</title>
      </Head>
      <GovUK.Page
        id="content"
        header={<CompleteHeader />}
        footer={<CompleteFooter />}
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
                            <Autocomplete
                              id="BaselAnnexIXCode"
                              source={suggest}
                              showAllValues={true}
                              onConfirm={(option) =>
                                setBaselAnnexIXCode({
                                  code: option.code,
                                  description: option.description,
                                })
                              }
                              confirmOnBlur={false}
                              defaultValue={
                                baselAnnexIXCode
                                  ? `${baselAnnexIXCode?.code}: ${baselAnnexIXCode?.description}`
                                  : ''
                              }
                              templates={{
                                inputValue: inputValueTemplate,
                                suggestion: suggestionTemplate,
                              }}
                              dropdownArrow={() => {
                                return;
                              }}
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
                            <Autocomplete
                              id="OecdCode"
                              source={suggest}
                              showAllValues={true}
                              onConfirm={(option) =>
                                setOecdCode({
                                  code: option.code,
                                  description: option.description,
                                })
                              }
                              confirmOnBlur={false}
                              defaultValue={
                                oecdCode
                                  ? `${oecdCode?.code}: ${oecdCode?.description}`
                                  : ''
                              }
                              templates={{
                                inputValue: inputValueTemplate,
                                suggestion: suggestionTemplate,
                              }}
                              dropdownArrow={() => {
                                return;
                              }}
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
                            <Autocomplete
                              id="AnnexIIIACode"
                              source={suggest}
                              showAllValues={true}
                              onConfirm={(option) =>
                                setAnnexIIIACode({
                                  code: option.code,
                                  description: option.description,
                                })
                              }
                              confirmOnBlur={false}
                              defaultValue={
                                annexIIIACode
                                  ? `${annexIIIACode?.code}: ${annexIIIACode?.description}`
                                  : ''
                              }
                              templates={{
                                inputValue: inputValueTemplate,
                                suggestion: suggestionTemplate,
                              }}
                              dropdownArrow={() => {
                                return;
                              }}
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
                            <Autocomplete
                              id="AnnexIIIBCode"
                              source={suggest}
                              showAllValues={true}
                              onConfirm={(option) =>
                                setAnnexIIIBCode({
                                  code: option.code,
                                  description: option.description,
                                })
                              }
                              confirmOnBlur={false}
                              defaultValue={
                                annexIIIBCode
                                  ? `${annexIIIBCode?.code}: ${annexIIIBCode?.description}`
                                  : ''
                              }
                              templates={{
                                inputValue: inputValueTemplate,
                                suggestion: suggestionTemplate,
                              }}
                              dropdownArrow={() => {
                                return;
                              }}
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
