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
import {
  isNotEmpty,
  validatePostcode,
  validateSelectAddress,
} from '../utils/validators';

const PostcodeInput = styled(GovUK.Input)`
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
  const [addresses, setAddresses] = useState<[]>();
  const [selectedAddress, setSelectedAddress] = useState<string>();
  const [errors, setErrors] = useState<{
    postcode?: string;
    selectedAddress?: string;
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
      if (isNotEmpty(newErrors)) {
        setErrors(newErrors);
      } else {
        setErrors(null);
        try {
          fetch(
            `${process.env.NX_API_GATEWAY_URL}/addresses?postcode=${postcode}`,
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
            }
          )
            .then((response) => {
              if (response.ok) return response.json();
            })
            .then((data) => {
              if (data !== undefined) {
                setAddresses(data);
              }
            });
        } catch (e) {
          console.error(e);
        }
      }
      e.preventDefault();
    },
    [postcode]
  );

  const handleLinkSubmit = (e) => {
    handleSubmitAddress(e, true);
  };

  const handleSubmitAddress = useCallback(
    (e: FormEvent, returnToDraft = false) => {
      const newErrors = {
        selectedAddress: validateSelectAddress(selectedAddress),
      };
      if (isNotEmpty(newErrors)) {
        setErrors(newErrors);
      } else {
        setErrors(null);
        const body = {
          status: 'Started',
          exporterAddress: JSON.parse(selectedAddress),
        };
        try {
          fetch(
            `${process.env.NX_API_GATEWAY_URL}/submissions/${id}/exporter-detail`,
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
                router.push({
                  pathname: '/exporter-details',
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
    [selectedAddress]
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

            {addresses && (
              <>
                <Paragraph>
                  {postcode.toUpperCase()}
                  <span> </span>
                  <AppLink href="#" onClick={() => setAddresses(null)}>
                    Change{' '}
                    <GovUK.VisuallyHidden>the postcode</GovUK.VisuallyHidden>
                  </AppLink>
                </Paragraph>
                <form onSubmit={handleSubmitAddress}>
                  <GovUK.FormGroup error={!!errors?.selectedAddress}>
                    <GovUK.Label htmlFor={'selectedAddress'}>
                      <GovUK.LabelText>
                        {t('postcode.selectLabel')}
                      </GovUK.LabelText>
                    </GovUK.Label>
                    <GovUK.ErrorText>{errors?.selectedAddress}</GovUK.ErrorText>
                    <GovUK.Select
                      label={''}
                      input={{
                        id: 'selectedAddress',
                        name: 'selectedAddress',
                        onChange: (e) => setSelectedAddress(e.target.value),
                      }}
                    >
                      <option value="">
                        {addresses.length > 1
                          ? t('postcode.addressesFound', {
                              n: addresses.length,
                            })
                          : t('postcode.addressFound', { n: addresses.length })}
                      </option>
                      {addresses.map((address, key) => {
                        return (
                          <option
                            key={`address${key}`}
                            value={JSON.stringify(address)}
                          >
                            {Object.keys(address)
                              .map((line) => address[line])
                              .join(', ')}
                          </option>
                        );
                      })}
                    </GovUK.Select>
                  </GovUK.FormGroup>
                  <Paragraph>
                    <AppLink
                      href={{
                        pathname: '/exporter-address',
                        query: { id },
                      }}
                    >
                      {t('postcode.notFoundLink')}
                    </AppLink>
                  </Paragraph>
                  <GovUK.Button id="saveButton">
                    {t('continueButton')}
                  </GovUK.Button>
                  <SaveReturnLink onClick={handleLinkSubmit} />
                </form>
              </>
            )}

            {!addresses && (
              <>
                <form onSubmit={handleSubmit}>
                  <GovUK.HintText>
                    {t('exportJourney.exporterPostcode.hint')}
                  </GovUK.HintText>
                  <GovUK.FormGroup error={!!errors?.postcode}>
                    <GovUK.Label htmlFor={'postcode'}>
                      <GovUK.LabelText>{t('postcode.label')}</GovUK.LabelText>
                    </GovUK.Label>
                    <GovUK.ErrorText>{errors?.postcode}</GovUK.ErrorText>
                    <PostcodeInput
                      name="postcode"
                      id="postcode"
                      value={postcode}
                      maxLength={50}
                      autoComplete="postal-code"
                      onChange={(e) => setPostcode(e.target.value)}
                    />
                  </GovUK.FormGroup>
                  <Paragraph>
                    <AppLink
                      href={{
                        pathname: 'exporter-details-manual',
                        query: { id },
                      }}
                    >
                      {t('postcode.manualAddressLink')}
                    </AppLink>
                  </Paragraph>
                  <GovUK.Button id="saveButton">
                    {t('postcode.findButton')}
                  </GovUK.Button>
                  <SaveReturnLink
                    href={{
                      pathname: '/submit-an-export-tasklist',
                      query: { id },
                    }}
                  />
                </form>
              </>
            )}
          </GovUK.GridCol>
        </GovUK.GridRow>
      </GovUK.Page>
    </>
  );
};

export default ExporterPostcode;
