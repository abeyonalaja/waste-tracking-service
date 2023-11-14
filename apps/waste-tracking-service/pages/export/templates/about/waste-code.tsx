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
import { isNotEmpty, validateWasteCode } from 'utils/validators';
import Autocomplete from 'accessible-autocomplete/react';
import i18n from 'i18next';

type codeType = {
  type: string;
  values: Array<{
    code: string;
    description: string;
  }>;
};

const WasteCode = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [templateId, setTemplateId] = useState<string>(null);
  const [data, setData] = useState<object>();
  const [refData, setRefData] = useState<Array<codeType>>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasValidId, setHasValidId] = useState<boolean>(false);
  const [wasteCodeCategory, setWasteCodeCategory] = useState<string>();
  const [baselAnnexIXCode, setBaselAnnexIXCode] = useState<string>();
  const [oecdCode, setOecdCode] = useState<string>();
  const [annexIIIACode, setAnnexIIIACode] = useState<string>();
  const [annexIIIBCode, setAnnexIIIBCode] = useState<string>();

  const url = `${process.env.NX_API_GATEWAY_URL}/templates/${templateId}/waste-description`;
  const currentLanguage = i18n.language;

  useEffect(() => {
    const fetchData = async () => {
      await fetch(
        `${process.env.NX_API_GATEWAY_URL}/wts-info/waste-codes?language=${currentLanguage}`
      )
        .then((response) => {
          if (response.ok) return response.json();
        })
        .then((data) => {
          if (data !== undefined) {
            setRefData(data);
          }
        });
    };
    if (currentLanguage) {
      fetchData();
    }
  }, [currentLanguage]);

  const setWasteCode = (category, code) => {
    if (category === 'BaselAnnexIX') setBaselAnnexIXCode(code);
    if (category === 'Oecd') setOecdCode(code);
    if (category === 'AnnexIIIA') setAnnexIIIACode(code);
    if (category === 'AnnexIIIB') setAnnexIIIBCode(code);
  };

  useEffect(() => {
    if (router.isReady) {
      setTemplateId(String(router.query.templateId));
    }
  }, [router.isReady, router.query.templateId]);

  useEffect(() => {
    setIsLoading(true);
    setHasValidId(false);
    if (templateId !== null) {
      try {
        fetch(
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
              setWasteCode(data.wasteCode?.type, data.wasteCode?.value);
              setHasValidId(true);
              setIsLoading(false);
            }
          });
      } catch (e) {
        console.error(e);
      }
    }
  }, [router.isReady, templateId]);

  const [errors, setErrors] = useState<{
    wasteCodeCategory?: string;
    baselAnnexIXCode?: string;
    oecdCode?: string;
    annexIIIACode?: string;
    annexIIIBCode?: string;
  }>({});

  function suggest(query, populateResults) {
    const results = refData.find((codeTypes: codeType) => {
      return codeTypes.type === wasteCodeCategory;
    });
    const filterResults = (result) => {
      const tempString = `${result.code}: ${result.description}`;
      return tempString.toLowerCase().indexOf(query.toLowerCase()) !== -1;
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
    return `${suggestion?.code}`;
  };

  const handleCancelReturn = (e) => {
    e.preventDefault();
    router.push({
      pathname: `/export/templates/tasklist`,
      query: { templateId },
    });
  };

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      const getWasteCode = () => {
        if (wasteCodeCategory === 'BaselAnnexIX') return baselAnnexIXCode;
        if (wasteCodeCategory === 'OECD') return oecdCode;
        if (wasteCodeCategory === 'AnnexIIIA') return annexIIIACode;
        if (wasteCodeCategory === 'AnnexIIIB') return annexIIIBCode;
        return undefined;
      };

      const newErrors = {
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
            fetch(url, {
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
      e.preventDefault();
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
                                setBaselAnnexIXCode(option.code)
                              }
                              confirmOnBlur={false}
                              defaultValue={baselAnnexIXCode}
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
                              onConfirm={(option) => setOecdCode(option.code)}
                              confirmOnBlur={false}
                              defaultValue={oecdCode}
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
                                setAnnexIIIACode(option.code)
                              }
                              confirmOnBlur={false}
                              defaultValue={annexIIIACode}
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
                                setAnnexIIIBCode(option.code)
                              }
                              confirmOnBlur={false}
                              defaultValue={annexIIIBCode}
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
