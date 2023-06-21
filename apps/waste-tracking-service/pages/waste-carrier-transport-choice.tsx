import React, { useEffect, useReducer, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import * as GovUK from 'govuk-react';
import '../i18n/config';
import { useTranslation } from 'react-i18next';
import {
  CompleteFooter,
  CompleteHeader,
  BreadcrumbWrap,
  SaveReturnButton,
  ButtonGroup,
  WasteCarrierHeadingNoCaps,
} from '../components';
import styled from 'styled-components';
import { isNotEmpty, validateTransport } from '../utils/validators';

const carrierNumber = '';

const SmallHeading = styled(GovUK.Caption)`
  margin-bottom: 0;
`;

const WasteCarrierContactDetails = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [id, setId] = useState(null);
  const [carrierCount, setCarrierCount] = useState(0);
  const [carrierIndex, setCarrierIndex] = useState(0);
  const [carrierId, setCarrierId] = useState(undefined);
  const [errors, setErrors] = useState<{
    selectedOption?: string;
  }>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);

  const [selectedOption, setSelectedOption] = useState('');
  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  useEffect(() => {
    if (router.isReady) {
      setId(router.query.id);
    }
  }, [router.isReady, router.query.id]);

  useEffect(() => {
    if (router.isReady) {
      setId(router.query.id);
      setCarrierId(router.query.carrierId);
    }
  }, [router.isReady, router.query.id, router.query.carrierId]);

  useEffect(() => {
    setIsLoading(true);
    setIsError(false);
    if (id !== null) {
      fetch(`${process.env.NX_API_GATEWAY_URL}/submissions/${id}/carriers`)
        .then((response) => {
          if (response.ok) return response.json();
          else {
            setIsLoading(false);
            setIsError(true);
          }
        })
        .then((data) => {
          if (data !== undefined) {
            const targetData = data.values.find(
              (singleCarrier) => singleCarrier.id === carrierId
            );
            setSelectedOption(targetData.transportDetails?.type);
            setCarrierCount(data.values.length);
            setCarrierIndex(
              data.values.findIndex(
                (item: { id: unknown }) => item.id === carrierId
              )
            );
            setIsLoading(false);
            setIsError(false);
          }
        });
    }
  }, [router.isReady, id, carrierId]);

  const handleRedirect = (e) => {
    const newErrors = {
      selectedOption: validateTransport(selectedOption),
    };
    if (isNotEmpty(newErrors)) {
      setErrors(newErrors);
    } else {
      setErrors(null);
      if (selectedOption === 'ShippingContainer') {
        router.push({
          pathname: '/waste-carrier-shipping-container',
          query: { id: router.query.id, carrierId: router.query.carrierId },
        });
      } else if (selectedOption === 'Trailer') {
        router.push({
          pathname: '/waste-carrier-trailer',
          query: { id: router.query.id, carrierId: router.query.carrierId },
        });
      } else if (selectedOption === 'BulkVessel') {
        router.push({
          pathname: '/waste-carrier-bulk-vessel',
          query: { id: router.query.id, carrierId: router.query.carrierId },
        });
      }
    }
    e.preventDefault();
  };

  const handleLinkSubmit = (e) => {
    router.push({
      pathname: '/submit-an-export-tasklist',
      query: { id: router.query.id },
    });
  };

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
        <title>
          {' '}
          {t('exportJourney.wasteCarrierTransport.pageQuestion', {
            n: carrierNumber,
          })}
        </title>
      </Head>
      <GovUK.Page
        id="content"
        header={<CompleteHeader />}
        footer={<CompleteFooter />}
        beforeChildren={<BreadCrumbs />}
      >
        <GovUK.GridRow>
          <GovUK.GridCol setWidth="two-thirds">
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
              <SmallHeading>
                {t('exportJourney.wasteCarrierDetails.title')}
              </SmallHeading>
              <GovUK.Heading size={'LARGE'}>
                <WasteCarrierHeadingNoCaps
                  index={carrierIndex}
                  noOfCarriers={carrierCount}
                  pageType="thirdPage"
                />
              </GovUK.Heading>

              <form onSubmit={handleRedirect}>
                <GovUK.FormGroup>
                  <GovUK.MultiChoice
                    label=""
                    meta={{
                      error: errors?.selectedOption,
                      touched: !!errors?.selectedOption,
                    }}
                  >
                    <GovUK.Radio
                      name="selectedOption"
                      id="ShippingContainer"
                      value="ShippingContainer"
                      checked={selectedOption === 'ShippingContainer'}
                      onChange={handleOptionChange}
                    >
                      {t('exportJourney.wasteCarrierTransport.optionOne')}
                    </GovUK.Radio>
                    <GovUK.Radio
                      name="selectedOption"
                      id="Trailer"
                      value="Trailer"
                      checked={selectedOption === 'Trailer'}
                      onChange={handleOptionChange}
                    >
                      {t('exportJourney.wasteCarrierTransport.optionTwo')}
                    </GovUK.Radio>
                    <GovUK.Radio
                      name="selectedOption"
                      id="BulkVessel"
                      value="BulkVessel"
                      checked={selectedOption === 'BulkVessel'}
                      onChange={handleOptionChange}
                    >
                      {t('exportJourney.wasteCarrierTransport.optionThree')}
                    </GovUK.Radio>
                  </GovUK.MultiChoice>
                </GovUK.FormGroup>
                <ButtonGroup>
                  <GovUK.Button id="saveButton">
                    {t('continueButton')}
                  </GovUK.Button>
                  <SaveReturnButton
                    onClick={() =>
                      router.push({
                        pathname: '/submit-an-export-tasklist',
                        query: { id },
                      })
                    }
                  >
                    {t('returnToDraft')}
                  </SaveReturnButton>
                </ButtonGroup>
              </form>
            </>
          </GovUK.GridCol>
        </GovUK.GridRow>
      </GovUK.Page>
    </>
  );
};
export default WasteCarrierContactDetails;
