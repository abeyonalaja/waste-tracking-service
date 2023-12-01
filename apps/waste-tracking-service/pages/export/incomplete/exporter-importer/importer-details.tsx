import React, { FormEvent, useCallback, useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import * as GovUK from 'govuk-react';

import { useTranslation } from 'react-i18next';
import {
  CompleteFooter,
  CompleteHeader,
  BreadcrumbWrap,
  SaveReturnButton,
  ButtonGroup,
  SubmissionNotFound,
  Loading,
} from 'components';
import { GetExporterDetailResponse } from '@wts/api/waste-tracking-gateway';
import styled from 'styled-components';
import {
  isNotEmpty,
  validateOrganisationName,
  validateCountry,
  validateAddress,
} from 'utils/validators';

const AddressInput = styled(GovUK.InputField)`
  @media (min-width: 641px) {
    width: 75%;
  }
`;

const ImporterDetails = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [id, setId] = useState(null);
  const [data, setData] = useState<GetExporterDetailResponse>(null);

  const [address, setAddress] = useState<string>('');
  const [country, setCountry] = useState<string>('');
  const [organisationName, setOrganisationName] = useState<string>('');
  const [errors, setErrors] = useState<{
    organisationName?: string;
    address?: string;
    country?: string;
  }>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  useEffect(() => {
    setIsLoading(true);
    setIsError(false);
    if (id !== null) {
      fetch(
        `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/submissions/${id}/importer-detail`
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
            setOrganisationName(data.importerAddressDetails?.organisationName);
            setAddress(data.importerAddressDetails?.address);
            setCountry(data.importerAddressDetails?.country);
            setIsLoading(false);
            setIsError(false);
          }
        });
    }
  }, [router.isReady, id]);
  useEffect(() => {
    if (router.isReady) {
      setId(router.query.id);
    }
  }, [router.isReady, router.query.id]);

  const handleLinkSubmit = (e) => {
    handleSubmit(e, true);
  };

  const handleSubmit = useCallback(
    (e: FormEvent, returnToDraft = false) => {
      const newErrors = {
        organisationName: validateOrganisationName(organisationName),
        address: validateAddress(address),
        country: validateCountry(country),
      };
      if (isNotEmpty(newErrors)) {
        setErrors(newErrors);
      } else {
        setErrors(null);
        const body = {
          ...data,
          status: 'Started',
          importerAddressDetails: {
            organisationName: organisationName,
            address: address,
            country: country,
          },
        };
        try {
          fetch(
            `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/submissions/${id}/importer-detail`,
            {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(body),
            }
          )
            .then((response) => {
              if (response.ok) return response.json();
            })
            .then((data) => {
              if (data !== undefined) {
                const path = returnToDraft
                  ? `/export/incomplete/tasklist`
                  : `/export/incomplete/exporter-importer/importer-contact-details`;
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
    [organisationName, address, country]
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
          Back
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
        header={<CompleteHeader />}
        footer={<CompleteFooter />}
        beforeChildren={<BreadCrumbs />}
      >
        <GovUK.GridRow>
          <GovUK.GridCol setWidth="two-thirds">
            {isError && !isLoading && <SubmissionNotFound />}
            {isLoading && <Loading />}
            {!isError && !isLoading && (
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
                        value: organisationName,
                        maxLength: 250,
                        onChange: (e) => setOrganisationName(e.target.value),
                      }}
                      meta={{
                        error: errors?.organisationName,
                        touched: !!errors?.organisationName,
                      }}
                    >
                      {t('contact.orgName')}
                    </AddressInput>
                    <GovUK.TextArea
                      mb={6}
                      input={{
                        name: 'address',
                        id: 'address',
                        value: address,
                        maxLength: 250,
                        onChange: (e) => setAddress(e.target.value),
                      }}
                      meta={{
                        error: errors?.address,
                        touched: !!errors?.address,
                      }}
                    >
                      {t('address')}
                    </GovUK.TextArea>
                    <AddressInput
                      mb={6}
                      input={{
                        name: 'country',
                        id: 'country',
                        value: country,
                        maxLength: 250,
                        onChange: (e) => setCountry(e.target.value),
                      }}
                      meta={{
                        error: errors?.country,
                        touched: !!errors?.country,
                      }}
                    >
                      {t('address.country')}
                    </AddressInput>
                  </GovUK.FormGroup>
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
export default ImporterDetails;
