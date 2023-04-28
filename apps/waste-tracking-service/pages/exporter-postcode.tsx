import React, { FormEvent, useCallback, useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import * as GovUK from 'govuk-react';
import '../i18n/config';
import { useTranslation } from 'react-i18next';
import {
  AppLink,
  CompleteFooter,
  CompleteHeader,
  BreadcrumbWrap,
  SaveReturnLink,
} from '../components';
import styled from 'styled-components';
import { validatePostcode } from '../utils/validators';

function isNotEmpty(obj) {
  return Object.keys(obj).some((key) => obj[key]?.length > 0);
}

const PostcodeInput = styled(GovUK.InputField)`
  max-width: 23ex;
`;

const Paragraph = styled.p`
  margin-bottom: 20px;
  font-size: 19px;
`;

const ExporterPostcode = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [id, setId] = useState(null);
  const [postcode, setPostcode] = useState<string>('');
  const [errors, setErrors] = useState<{
    postcode?: string;
  }>({});

  useEffect(() => {
    if (router.isReady) {
      setId(router.query.id);
    }
  }, [router.isReady, router.query.id]);

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      const newErrors = {
        postcode: validatePostcode(postcode),
      };
      console.log(newErrors);
      if (isNotEmpty(newErrors)) {
        setErrors(newErrors);
      } else {
        setErrors(null);
      }
      e.preventDefault();
    },
    [postcode]
  );

  const BreadCrumbs = () => {
    return (
      <BreadcrumbWrap>
        <GovUK.BackLink
          href="#"
          onClick={() => {
            router.push({
              pathname: '/submit-an-export-tasklist',
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
        <title>{t('exportJourney.exporterPostcode.title')}</title>
      </Head>
      <GovUK.Page
        id="content"
        header={<CompleteHeader />}
        footer={<CompleteFooter />}
        beforeChildren={<BreadCrumbs />}
      >
        <GovUK.GridRow>
          <GovUK.GridCol setWidth="two-thirds">
            {errors && !!Object.keys(errors).length && (
              <GovUK.ErrorSummary
                heading={t('errorSummary.title')}
                errors={Object.keys(errors).map((key) => ({
                  targetName: key,
                  text: errors[key],
                }))}
              />
            )}
            <GovUK.Heading size={'LARGE'}>
              {t('exportJourney.exporterPostcode.title')}
            </GovUK.Heading>
            <form onSubmit={handleSubmit}>
              <GovUK.HintText>
                {t('exportJourney.exporterPostcode.hint')}
              </GovUK.HintText>
              <GovUK.FormGroup>
                <PostcodeInput
                  input={{
                    name: 'postcode',
                    id: 'postcode',
                    maxLength: 50,
                    autoComplete: 'postal-code',
                    onChange: (e) => setPostcode(e.target.value),
                  }}
                  meta={{
                    error: errors?.postcode,
                    touched: !!errors?.postcode,
                  }}
                >
                  {t('exportJourney.exporterPostcode.postCodeLabel')}
                </PostcodeInput>
              </GovUK.FormGroup>
              <Paragraph>
                <AppLink
                  href={{
                    pathname: 'exporter-details-manual',
                    query: { id },
                  }}
                >
                  {t('exportJourney.exporterPostcode.manualAddressLink')}
                </AppLink>
              </Paragraph>
              <GovUK.Button id="saveButton">{t('saveButton')}</GovUK.Button>
              <SaveReturnLink
                href={{ pathname: '/submit-an-export-tasklist', query: { id } }}
              />
            </form>
          </GovUK.GridCol>
        </GovUK.GridRow>
      </GovUK.Page>
    </>
  );
};

export default ExporterPostcode;
