import React, { FormEvent, useCallback, useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import * as GovUK from 'govuk-react';

import { useTranslation } from 'react-i18next';
import {
  Footer,
  Header,
  BreadcrumbWrap,
  SaveReturnButton,
  ButtonGroup,
  SubmissionNotFound,
  Loading,
  CountrySelector,
  ErrorSummary,
} from 'components';
import { getStatusImporter } from 'utils/statuses/getStatusImporter';
import { GetExporterDetailResponse } from '@wts/api/waste-tracking-gateway';
import styled from 'styled-components';
import useApiConfig from 'utils/useApiConfig';
import { isNotEmpty, validateSameAsTransit } from 'utils/validators';

const AddressInput = styled(GovUK.InputField)`
  @media (min-width: 641px) {
    width: 75%;
  }
`;

const ImporterDetails = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const apiConfig = useApiConfig();
  const [templateId, setTemplateId] = useState(null);
  const [data, setData] = useState<GetExporterDetailResponse>(null);
  const [address, setAddress] = useState<string>('');
  const [country, setCountry] = useState(null);
  const [organisationName, setOrganisationName] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [errors, setErrors] = useState<{
    countryIncludedInTransit?: string;
  }>({});
  const [transitCountries, setTransitCountries] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setIsError(false);
      if (templateId !== null) {
        await fetch(
          `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/templates/${templateId}/importer-detail`,
          { headers: apiConfig }
        )
          .then((response) => {
            if (response.ok) return response.json();
            else {
              setIsLoading(false);
              setIsError(true);
            }
          })
          .then((data) => {
            if (data !== undefined) {
              setData(data);
              setOrganisationName(
                data.importerAddressDetails?.organisationName
              );

              setAddress(data.importerAddressDetails?.address);
              setCountry(data.importerAddressDetails?.country);
              setIsLoading(false);
              setIsError(false);
            }
          });
      }
    };
    fetchData();
  }, [router.isReady, templateId]);

  useEffect(() => {
    if (router.isReady) {
      setTemplateId(router.query.templateId);
    }
  }, [router.isReady, router.query.templateId]);

  useEffect(() => {
    const fetchData = async () => {
      setIsError(false);
      if (templateId !== null) {
        await fetch(
          `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/templates/${templateId}/transit-countries`,
          { headers: apiConfig }
        )
          .then((response) => {
            if (response.ok) return response.json();
            else {
              setIsError(true);
              setIsLoading(false);
            }
          })
          .then((data) => {
            if (data !== undefined) {
              setTransitCountries(data.values);
            }
          });
      }
    };
    fetchData();
  }, [router.isReady, templateId, country]);
  const handleCancelReturn = (e) => {
    e.preventDefault();
    router.push({
      pathname: `/templates/tasklist`,
      query: { templateId },
    });
  };

  const handleSubmit = useCallback(
    async (e: FormEvent, returnToDraft = false) => {
      e.preventDefault();
      const newErrors = {
        countryIncludedInTransit: validateSameAsTransit(
          country,
          transitCountries
        ),
      };
      if (isNotEmpty(newErrors)) {
        setErrors(newErrors);
      } else {
        setErrors(null);
        const body = {
          ...data,
          importerAddressDetails: {
            organisationName: organisationName || '',
            address: address || '',
            country: country || '',
          },
        };
        const updatedStatus = {
          ...body,
          status: getStatusImporter(body),
        };
        try {
          await fetch(
            `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/templates/${templateId}/importer-detail`,
            {
              method: 'PUT',
              headers: apiConfig,
              body: JSON.stringify(updatedStatus),
            }
          )
            .then((response) => {
              if (response.ok) return response.json();
            })
            .then((data) => {
              if (data !== undefined) {
                const path = returnToDraft
                  ? `/templates/tasklist`
                  : `/templates/exporter-importer/importer-contact-details`;
                router.push({
                  pathname: path,
                  query: { templateId },
                });
              }
            });
        } catch (e) {
          console.error(e);
        }
      }
    },
    [organisationName, address, country, data]
  );
  const BreadCrumbs = () => {
    return (
      <BreadcrumbWrap>
        <GovUK.BackLink
          href="#"
          onClick={() => {
            history.back();
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
        <title>{t('exportJourney.importerDetails.firstPageQuestion')}</title>
      </Head>
      <GovUK.Page
        id="content"
        header={<Header />}
        footer={<Footer />}
        beforeChildren={<BreadCrumbs />}
      >
        <GovUK.GridRow>
          <GovUK.GridCol setWidth="two-thirds">
            {isError && !isLoading && <SubmissionNotFound />}
            {isLoading && <Loading />}
            {!isError && !isLoading && (
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
                  {t('exportJourney.importerDetails.title')}
                </GovUK.Caption>
                <GovUK.Heading size={'LARGE'}>
                  {t('exportJourney.importerDetails.firstPageQuestion')}
                </GovUK.Heading>

                <form onSubmit={handleSubmit}>
                  <GovUK.FormGroup>
                    <AddressInput
                      mb={6}
                      input={{
                        name: 'organisationName',
                        id: 'organisationName',
                        value: organisationName || '',
                        maxLength: 250,
                        onChange: (e) => setOrganisationName(e.target.value),
                      }}
                    >
                      {t('contact.orgName')}
                    </AddressInput>
                    <GovUK.TextArea
                      mb={6}
                      input={{
                        name: 'address',
                        id: 'address',
                        value: address || '',
                        maxLength: 250,
                        onChange: (e) => setAddress(e.target.value),
                      }}
                    >
                      {t('address')}
                    </GovUK.TextArea>
                    <CountrySelector
                      size={75}
                      id={'country'}
                      name={'country'}
                      label={t('address.country')}
                      value={country || ''}
                      onChange={setCountry}
                      error={errors?.countryIncludedInTransit}
                      apiConfig={apiConfig}
                    />
                  </GovUK.FormGroup>
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
export default ImporterDetails;
ImporterDetails.auth = true;
