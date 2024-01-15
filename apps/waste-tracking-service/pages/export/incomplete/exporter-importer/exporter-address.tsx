import React, { FormEvent, useCallback, useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import * as GovUK from 'govuk-react';

import { useTranslation } from 'react-i18next';
import {
  AppLink,
  Footer,
  Header,
  BreadcrumbWrap,
  Loading,
  SubmissionNotFound,
  SaveReturnButton,
  ButtonGroup,
  Paragraph,
  Address,
} from 'components';
import { GetExporterDetailResponse } from '@wts/api/waste-tracking-gateway';
import styled from 'styled-components';
import { BORDER_COLOUR } from 'govuk-colours';
import { getApiConfig } from 'utils/api/apiConfig';
import { PageProps } from 'types/wts';
export const getServerSideProps = async (context) => {
  return getApiConfig(context);
};

const DefinitionList = styled('dl')`
  margin-bottom: 20px;
  font-size: 16px;
  line-height: 1.25;
  @media (min-width: 40.0625em) {
    margin-bottom: 30px;
    display: table;
    width: 100%;
    table-layout: fixed;
    border-collapse: collapse;
    font-size: 19px;
    line-height: 1.35;
  }
`;

const Row = styled('div')`
  border-bottom: 1px solid ${BORDER_COLOUR};
  margin-bottom: 15px;
  @media (min-width: 40.0625em) {
    display: table-row;
  }
`;

const Title = styled('dt')`
  margin-bottom: 5px;
  font-weight: 700;
  @media (min-width: 40.0625em) {
    display: table-cell;
    padding-top: 10px;
    padding-right: 20px;
    padding-bottom: 10px;
    margin-bottom: 5px;
    width: 18%;
  }
`;

const Definition = styled('dd')`
  margin-bottom: 5px;
  margin-left: 0;
  @media (min-width: 40.0625em) {
    display: table-cell;
    padding-top: 10px;
    padding-right: 20px;
    padding-bottom: 10px;
    margin-bottom: 5px;
    width: 68%;
  }
  &::first-letter {
    text-transform: uppercase;
  }
`;

const Actions = styled('dd')`
  margin: 10px 0 15px;
  @media (min-width: 40.0625em) {
    width: 14%;
    display: table-cell;
    padding-top: 10px;
    padding-bottom: 10px;
    margin-bottom: 5px;
    text-align: right;
  }
  a {
    margin-right: 10px;
    @media (min-width: 40.0625em) {
      margin: 0 0 0 15px;
    }
  }
`;

const ExporterAddress = ({ apiConfig }: PageProps) => {
  const { t } = useTranslation();
  const router = useRouter();
  const [id, setId] = useState(null);
  const [data, setData] = useState<GetExporterDetailResponse>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);

  useEffect(() => {
    if (router.isReady) {
      setId(router.query.id);
    }
  }, [router.isReady, router.query.id]);

  useEffect(() => {
    setIsLoading(true);
    setIsError(false);
    const fetchData = async () => {
      if (id !== null) {
        await fetch(
          `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/submissions/${id}/exporter-detail`,
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
              setIsLoading(false);
              setIsError(false);
            }
          });
      }
    };
    fetchData();
  }, [router.isReady, id]);

  const handleLinkSubmit = (e) => {
    handleSubmit(e, true);
  };

  const handleSubmit = useCallback(
    (e: FormEvent, returnToDraft = false) => {
      const path = returnToDraft
        ? `/export/incomplete/tasklist`
        : `/export/incomplete/exporter-importer/exporter-details`;
      router.push({
        pathname: path,
        query: { id },
      });
      e.preventDefault();
    },
    [id, router]
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
        <title>{t('exportJourney.exporterDetails.title')}</title>
      </Head>
      <GovUK.Page
        id="content"
        header={<Header />}
        footer={<Footer />}
        beforeChildren={<BreadCrumbs />}
      >
        <GovUK.GridRow id="page-exporter-contact-details">
          <GovUK.GridCol setWidth="two-thirds">
            {isError && !isLoading && <SubmissionNotFound />}
            {isLoading && <Loading />}
            {!isError && !isLoading && (
              <>
                <GovUK.Caption size="L">
                  {t('exportJourney.exporterDetails.caption')}
                </GovUK.Caption>
                <GovUK.Heading size={'LARGE'}>
                  {t('exportJourney.exporterAddress.title')}
                </GovUK.Heading>
                {data.status !== 'NotStarted' && (
                  <Paragraph>
                    <>
                      {t('postcode.checkAddress.exportingCountryStart')}
                      <strong>{data.exporterAddress.country}</strong>
                      {t('postcode.checkAddress.exportingCountryEnd')}
                    </>
                  </Paragraph>
                )}
                <DefinitionList id="address-list">
                  <Row>
                    <Title>{t('postcode.checkAddress.address')}</Title>
                    <Definition id="exporter-address">
                      {data.status !== 'NotStarted' && (
                        <Address address={data.exporterAddress} />
                      )}
                    </Definition>

                    <Actions>
                      <AppLink
                        id="address-change-link"
                        href={{
                          pathname: `/export/incomplete/exporter-importer/exporter-details-manual`,
                          query: { id },
                        }}
                      >
                        {t('address.justChange')}
                      </AppLink>
                    </Actions>
                  </Row>
                </DefinitionList>

                <form onSubmit={handleSubmit}>
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

export default ExporterAddress;
ExporterAddress.auth = true;
