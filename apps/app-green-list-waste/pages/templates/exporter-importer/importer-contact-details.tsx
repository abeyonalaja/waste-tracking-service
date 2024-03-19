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
  ErrorSummary,
  SubmissionNotFound,
  Loading,
} from 'components';
import { GetExporterDetailResponse } from '@wts/api/waste-tracking-gateway';
import styled from 'styled-components';
import {
  isNotEmpty,
  validateEmail,
  validateInternationalFax,
  validateInternationalPhone,
} from 'utils/validators';
import { getStatusImporter } from 'utils/statuses/getStatusImporter';
import useApiConfig from 'utils/useApiConfig';

const AddressInput = styled(GovUK.InputField)`
  max-width: 66ex;
  margin-bottom: 20px;
`;
const PostcodeInput = styled(GovUK.InputField)`
  max-width: 56ex;
  margin-bottom: 20px;
`;

const ImporterContactDetails = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const apiConfig = useApiConfig();
  const [templateId, setTemplateId] = useState(null);
  const [data, setData] = useState<GetExporterDetailResponse>(null);
  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [fax, setFax] = useState<string>('');
  const [errors, setErrors] = useState<{
    email?: string;
    phone?: string;
    fax?: string;
  }>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);

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
              setFullName(data.importerContactDetails?.fullName || '');
              setEmail(data.importerContactDetails?.emailAddress || '');
              setPhone(data.importerContactDetails?.phoneNumber || '');
              setFax(data.importerContactDetails?.faxNumber || '');
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
        email: validateEmail(email, true),
        phone: validateInternationalPhone(phone, true),
        fax: validateInternationalFax(fax, true),
      };
      if (isNotEmpty(newErrors)) {
        setErrors(newErrors);
      } else {
        setErrors(null);
        const body = {
          ...data,
          importerContactDetails: {
            fullName: fullName || '',
            emailAddress: email || '',
            phoneNumber: phone || '',
            faxNumber: fax || '',
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
                const path = `/templates/tasklist`;
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
    [fullName, email, phone, fax, data]
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
        <title>{t('exportJourney.importerDetails.secondPageQuestion')}</title>
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
                  {t('exportJourney.importerDetails.secondPageQuestion')}
                </GovUK.Heading>

                <form onSubmit={handleSubmit}>
                  <GovUK.FormGroup>
                    <AddressInput
                      hint={<>{t('contact.nameHint')}</>}
                      input={{
                        name: 'fullName',
                        id: 'fullName',
                        value: fullName,
                        maxLength: 250,
                        onChange: (e) => setFullName(e.target.value),
                      }}
                    >
                      {t('exportJourney.importerDetails.contactPerson')}
                    </AddressInput>
                    <AddressInput
                      input={{
                        name: 'email',
                        id: 'email',
                        value: email,
                        maxLength: 250,
                        onChange: (e) => setEmail(e.target.value),
                      }}
                      meta={{
                        error: errors?.email,
                        touched: !!errors?.email,
                      }}
                    >
                      {t('contact.emailAddress')}
                    </AddressInput>
                    <PostcodeInput
                      hint={t('contact.numberHint')}
                      input={{
                        name: 'phone',
                        id: 'phone',
                        value: phone,
                        maxLength: 250,
                        onChange: (e) => setPhone(e.target.value),
                      }}
                      meta={{
                        error: errors?.phone,
                        touched: !!errors?.phone,
                      }}
                    >
                      {t('contact.phoneNumber')}
                    </PostcodeInput>
                    <PostcodeInput
                      hint={t('contact.numberHint')}
                      input={{
                        name: 'fax',
                        id: 'fax',
                        value: fax,
                        maxLength: 250,
                        onChange: (e) => setFax(e.target.value),
                      }}
                      meta={{
                        error: errors?.fax,
                        touched: !!errors?.fax,
                      }}
                    >
                      {t('contact.faxNumber')}
                    </PostcodeInput>
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
export default ImporterContactDetails;
ImporterContactDetails.auth = true;
