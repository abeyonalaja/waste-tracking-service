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
import { getStatusImporter } from 'utils/statuses/getStatusImporter';
import { GetExporterDetailResponse } from '@wts/api/waste-tracking-gateway';
import styled from 'styled-components';

const AddressInput = styled(GovUK.InputField)`
  @media (min-width: 641px) {
    width: 75%;
  }
`;

const ImporterDetails = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [templateId, setTemplateId] = useState(null);
  const [data, setData] = useState<GetExporterDetailResponse>(null);
  const [address, setAddress] = useState<string>('');
  const [country, setCountry] = useState<string>('');
  const [organisationName, setOrganisationName] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);

  useEffect(() => {
    setIsLoading(true);
    setIsError(false);
    if (templateId !== null) {
      fetch(
        `${process.env.NX_API_GATEWAY_URL}/templates/${templateId}/importer-detail`
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
  }, [router.isReady, templateId]);

  useEffect(() => {
    if (router.isReady) {
      setTemplateId(router.query.templateId);
    }
  }, [router.isReady, router.query.templateId]);

  const handleCancelReturn = (e) => {
    e.preventDefault();
    router.push({
      pathname: `/export/templates/tasklist`,
      query: { templateId },
    });
  };

  const handleSubmit = useCallback(
    (e: FormEvent, returnToDraft = false) => {
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
        fetch(
          `${process.env.NX_API_GATEWAY_URL}/templates/${templateId}/importer-detail`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedStatus),
          }
        )
          .then((response) => {
            if (response.ok) return response.json();
          })
          .then((data) => {
            if (data !== undefined) {
              const path = returnToDraft
                ? `/export/templates/tasklist`
                : `/export/templates/exporter-importer/importer-contact-details`;
              router.push({
                pathname: path,
                query: { templateId },
              });
            }
          });
      } catch (e) {
        console.error(e);
      }

      e.preventDefault();
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
                    <AddressInput
                      mb={6}
                      input={{
                        name: 'country',
                        id: 'country',
                        value: country || '',
                        maxLength: 250,
                        onChange: (e) => setCountry(e.target.value),
                      }}
                    >
                      {t('address.country')}
                    </AddressInput>
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
