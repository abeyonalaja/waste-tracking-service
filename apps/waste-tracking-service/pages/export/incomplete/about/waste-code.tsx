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
import {
  isNotEmpty,
  validateWasteCode,
  validateWasteCodeCategory,
} from 'utils/validators';
import Autocomplete from 'accessible-autocomplete/react';
import { wasteCodeData } from 'utils/wasteCodesData';
import { PutWasteQuantityRequest } from '@wts/api/waste-tracking-gateway';

const WasteCode = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [id, setId] = useState<string | string[]>(null);
  const [data, setData] = useState<object>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasValidId, setHasValidId] = useState<boolean>(false);
  const [wasteCodeCategory, setWasteCodeCategory] = useState<string>();
  const [baselAnnexIXCode, setBaselAnnexIXCode] = useState<string>();
  const [oecdCode, setOecdCode] = useState<string>();
  const [annexIIIACode, setAnnexIIIACode] = useState<string>();
  const [annexIIIBCode, setAnnexIIIBCode] = useState<string>();
  const [isBulkOrSmall, setIsBulkOrSmall] = useState<string>(null);

  const url = `${process.env.NX_API_GATEWAY_URL}/submissions/${id}/waste-description`;

  const setWasteCode = (category, code) => {
    if (category === 'BaselAnnexIX') setBaselAnnexIXCode(code);
    if (category === 'Oecd') setOecdCode(code);
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
    if (id !== null) {
      try {
        fetch(
          `${process.env.NX_API_GATEWAY_URL}/submissions/${id}/waste-description`
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
              setWasteCode(data.wasteCode?.type, data.wasteCode?.value);
              setHasValidId(true);
              setIsLoading(false);
            }
          });
      } catch (e) {
        console.error(e);
      }
    }
  }, [router.isReady, id]);

  const [errors, setErrors] = useState<{
    wasteCodeCategory?: string;
    baselAnnexIXCode?: string;
    oecdCode?: string;
    annexIIIACode?: string;
    annexIIIBCode?: string;
  }>({});

  function suggest(query, populateResults) {
    const results = wasteCodeData[wasteCodeCategory];
    const filteredResults = results.filter(
      (result) => result.toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
    populateResults(filteredResults);
  }

  const handleLinkSubmit = (e) => {
    handleSubmit(e, true);
  };

  const handleSubmit = useCallback(
    (e: FormEvent, returnToDraft) => {
      const getWasteCode = () => {
        if (wasteCodeCategory === 'BaselAnnexIX') return baselAnnexIXCode;
        if (wasteCodeCategory === 'Oecd') return oecdCode;
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
            value: getWasteCode(),
          },
        };

        if (isBulkOrSmall !== null) {
          const submittedWasteCodeType = getWasteCodeType(wasteCodeCategory);
          if (isBulkOrSmall !== submittedWasteCodeType) {
            try {
              const data: PutWasteQuantityRequest = { status: 'NotStarted' };
              fetch(
                `${process.env.NX_API_GATEWAY_URL}/submissions/${id}/waste-quantity`,
                {
                  method: 'PUT',
                  headers: {
                    'Content-Type': 'application/json',
                  },
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
                if (wasteCodeCategory === 'NotApplicable' && !data.ewcCodes) {
                  const path = returnToDraft
                    ? `/export/incomplete/tasklist`
                    : `/export/incomplete/about/ewc-add`;
                  router.push({
                    pathname: path,
                    query: { id },
                  });
                }
                if (wasteCodeCategory === 'NotApplicable' && data.ewcCodes) {
                  const path = returnToDraft
                    ? `/export/incomplete/tasklist`
                    : `/export/incomplete/about/ewc-list`;
                  router.push({
                    pathname: path,
                    query: { id },
                  });
                }

                if (wasteCodeCategory !== 'NotApplicable' && !data.ewcCodes) {
                  const path = returnToDraft
                    ? `/export/incomplete/tasklist`
                    : `/export/incomplete/about/ewc`;
                  router.push({
                    pathname: path,
                    query: { id },
                  });
                }

                if (wasteCodeCategory !== 'NotApplicable' && data.ewcCodes) {
                  const path = returnToDraft
                    ? `/export/incomplete/tasklist`
                    : `/export/incomplete/about/ewc-list`;
                  router.push({
                    pathname: path,
                    query: { id },
                  });
                }
              }
            });
        } catch (e) {
          console.error(e);
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
                            <Autocomplete
                              id="BaselAnnexIXCode"
                              source={suggest}
                              showAllValues={true}
                              onConfirm={(option) =>
                                setBaselAnnexIXCode(option)
                              }
                              confirmOnBlur={false}
                              defaultValue={baselAnnexIXCode}
                            />
                          </GovUK.FormGroup>
                        </ConditionalRadioWrap>
                      )}
                      <GovUK.Radio
                        name="wasteCodeCategory"
                        id="wasteCodeCategoryBaselOECD"
                        checked={wasteCodeCategory === 'Oecd'}
                        onChange={() => setWasteCodeCategory('Oecd')}
                      >
                        OECD
                      </GovUK.Radio>
                      {wasteCodeCategory === 'Oecd' && (
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
                              onConfirm={(option) => setOecdCode(option)}
                              confirmOnBlur={false}
                              defaultValue={oecdCode}
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
                              onConfirm={(option) => setAnnexIIIACode(option)}
                              confirmOnBlur={false}
                              defaultValue={annexIIIACode}
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
                              onConfirm={(option) => setAnnexIIIBCode(option)}
                              confirmOnBlur={false}
                              defaultValue={annexIIIBCode}
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
