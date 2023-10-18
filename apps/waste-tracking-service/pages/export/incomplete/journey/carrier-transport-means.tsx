import React, {
  useEffect,
  useState,
  useReducer,
  useCallback,
  FormEvent,
} from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import * as GovUK from 'govuk-react';
import { useTranslation } from 'react-i18next';
import {
  CompleteFooter,
  CompleteHeader,
  BreadcrumbWrap,
  Loading,
  Paragraph,
  Error404Content,
  ButtonGroup,
  SaveReturnButton,
  TextareaCharCount,
} from 'components';
import {
  isNotEmpty,
  validateTransport,
  validateTransportDescription,
} from 'utils/validators';

enum VIEWS {
  CHOICE = 1,
  DETAILS = 2,
}

type State = {
  data: any;
  isLoading: boolean;
  isError: boolean;
  showView: number;
};

type Action = {
  type:
    | 'DATA_FETCH_INIT'
    | 'DATA_FETCH_SUCCESS'
    | 'DATA_FETCH_FAILURE'
    | 'SHOW_VIEW';
  payload?: any;
};

const initialState: State = {
  data: { status: 'Started', values: [] },
  isLoading: true,
  isError: false,
  showView: VIEWS.CHOICE,
};

const carrierReducer = (state: State, action: Action) => {
  switch (action.type) {
    case 'DATA_FETCH_INIT':
      return {
        ...state,
        isLoading: true,
        isError: false,
      };
    case 'DATA_FETCH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload,
      };
    case 'DATA_FETCH_FAILURE':
      return {
        ...state,
        isLoading: false,
        isError: true,
      };
    case 'SHOW_VIEW':
      return {
        ...state,
        errors: null,
        isLoading: false,
        isError: false,
        showView: action.payload,
      };
    default:
      throw new Error();
  }
};

const CarrierTransportMeans = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [carrierPage, dispatchCarrierPage] = useReducer(
    carrierReducer,
    initialState
  );
  const [id, setId] = useState(null);
  const [page, setPage] = useState(null);
  const [carrierId, setCarrierId] = useState(null);
  const [carrierIndex, setCarrierIndex] = useState(0);
  const [transportType, setTransportType] = useState(null);
  const [transportDescription, setTransportDescription] = useState('');
  const [errors, setErrors] = useState(null);

  useEffect(() => {
    if (router.isReady) {
      setId(router.query.id);
      setPage(router.query.page || null);
      setCarrierId(router.query.carrierId);
      setCarrierIndex(parseInt(router.query.carrierIndex?.toString()) || 0);
    }
  }, [
    router.isReady,
    router.query.id,
    router.query.carrierId,
    router.query.carrierIndex,
  ]);

  useEffect(() => {
    const fetchData = async () => {
      dispatchCarrierPage({ type: 'DATA_FETCH_INIT' });
      if (id !== null) {
        await fetch(
          `${process.env.NX_API_GATEWAY_URL}/submissions/${id}/carriers/${carrierId}`
        )
          .then((response) => {
            if (response.ok) return response.json();
            else {
              dispatchCarrierPage({ type: 'DATA_FETCH_FAILURE' });
            }
          })
          .then((data) => {
            if (data !== undefined) {
              dispatchCarrierPage({
                type: 'DATA_FETCH_SUCCESS',
                payload: data,
              });
              setTransportType(data.values[0].transportDetails?.type || null);
              setTransportDescription(
                data.values[0].transportDetails?.description || ''
              );
              if (page !== null) {
                dispatchCarrierPage({
                  type: 'SHOW_VIEW',
                  payload: VIEWS[page],
                });
              }
            }
          });
      }
    };
    fetchData();
  }, [router.isReady, id, page]);

  const printBullets = () => {
    const bullets = t(
      `exportJourney.wasteCarrierTransport.${transportType}Bullets`
    ).split('*');
    return bullets.map((bullet, index) => {
      return <GovUK.ListItem key={`bullet${index}`}>{bullet}</GovUK.ListItem>;
    });
  };

  const handleLinkSubmit = (e: FormEvent) => {
    handleSubmit(e, true);
  };

  const handleSubmit = useCallback(
    async (e: FormEvent, returnToDraft = false) => {
      e.preventDefault();
      const newErrors = {
        transportTypeError: validateTransport(transportType),
        transportDescriptionError: validateTransportDescription(
          t(
            `exportJourney.wasteCarrierTransport.${transportType}`
          ).toLowerCase(),
          t(`numberAdjective.${carrierIndex + 1}`),
          transportDescription
        ),
      };
      if (isNotEmpty(newErrors)) {
        setErrors(newErrors);
      } else {
        setErrors(null);
        const body = carrierPage.data;
        body.status = 'Complete';
        body.values[0].transportDetails = {
          type: transportType,
          description: transportDescription,
        };

        const url = `${process.env.NX_API_GATEWAY_URL}/submissions/${id}/carriers/${carrierId}`;
        try {
          fetch(url, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
          })
            .then((response) => response.json())
            .then((data) => {
              dispatchCarrierPage({
                type: 'DATA_FETCH_SUCCESS',
                payload: data,
              });
              if (returnToDraft || carrierPage.showView === VIEWS.DETAILS) {
                const path = returnToDraft
                  ? `/export/incomplete/tasklist`
                  : `/export/incomplete/journey/carriers`;
                router.push({
                  pathname: path,
                  query: { id },
                });
              } else {
                dispatchCarrierPage({
                  type: 'SHOW_VIEW',
                  payload: VIEWS.DETAILS,
                });
              }
            });
        } catch (e) {
          console.error(e);
        }
      }
    },
    [router, transportType, transportDescription, carrierPage, carrierIndex]
  );

  const BreadCrumbs = () => {
    return (
      <BreadcrumbWrap>
        <GovUK.BackLink
          href="#"
          onClick={(e) => {
            if (carrierPage.showView === VIEWS.CHOICE) {
              router.push({
                pathname: 'carrier-contact-details',
                query: { id, carrierId },
              });
            }
            if (carrierPage.showView === VIEWS.DETAILS) {
              dispatchCarrierPage({
                type: 'SHOW_VIEW',
                payload: VIEWS.CHOICE,
              });
            }
            e.preventDefault();
          }}
        >
          {t('back')}
        </GovUK.BackLink>
      </BreadcrumbWrap>
    );
  };

  return (
    <>
      <Head>
        <title>{t('exportJourney.wasteCarrierDetails.title')}</title>
      </Head>
      <GovUK.Page
        id="content"
        header={<CompleteHeader />}
        footer={<CompleteFooter />}
        beforeChildren={<BreadCrumbs />}
      >
        <GovUK.GridRow>
          <GovUK.GridCol setWidth="two-thirds">
            {carrierPage.isError && !carrierPage.isLoading && (
              <Error404Content />
            )}
            {carrierPage.isLoading && <Loading />}
            {!carrierPage.isError && !carrierPage.isLoading && (
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
                  {t('exportJourney.wasteCarrierDetails.title')}
                </GovUK.Caption>
                {carrierPage.showView === VIEWS.CHOICE && (
                  <>
                    <form onSubmit={handleSubmit}>
                      <GovUK.Fieldset>
                        <GovUK.Fieldset.Legend isPageHeading size="LARGE">
                          {t(
                            'exportJourney.wasteCarrierTransport.pageQuestion',
                            {
                              carrierIndex: t(
                                `numberAdjective.${carrierIndex + 1}`
                              ),
                            }
                          )}
                        </GovUK.Fieldset.Legend>
                        <GovUK.MultiChoice
                          mb={6}
                          label=""
                          meta={{
                            error: errors?.transportTypeError,
                            touched: !!errors?.transportTypeError,
                          }}
                        >
                          <GovUK.Radio
                            name="transportType"
                            id="transportTypeRoad"
                            checked={transportType === 'Road'}
                            onChange={() => setTransportType('Road')}
                            value="Road"
                          >
                            {t('exportJourney.wasteCarrierTransport.Road')}
                          </GovUK.Radio>
                          <GovUK.Radio
                            name="transportType"
                            id="transportTypeSea"
                            checked={transportType === 'Sea'}
                            onChange={() => setTransportType('Sea')}
                            value="Sea"
                          >
                            {t('exportJourney.wasteCarrierTransport.Sea')}
                          </GovUK.Radio>
                          <GovUK.Radio
                            name="transportType"
                            id="transportTypeAir"
                            checked={transportType === 'Air'}
                            onChange={() => setTransportType('Air')}
                            value="Air"
                          >
                            {t('exportJourney.wasteCarrierTransport.Air')}
                          </GovUK.Radio>
                          <GovUK.Radio
                            name="transportType"
                            id="transportTypeRail"
                            checked={transportType === 'Rail'}
                            onChange={() => setTransportType('Rail')}
                            value="Rail"
                          >
                            {t('exportJourney.wasteCarrierTransport.Rail')}
                          </GovUK.Radio>
                          <GovUK.Radio
                            name="transportType"
                            id="transportTypeWater"
                            checked={transportType === 'InlandWaterways'}
                            onChange={() => setTransportType('InlandWaterways')}
                            value="Water"
                          >
                            {t(
                              'exportJourney.wasteCarrierTransport.InlandWaterways'
                            )}
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
                {carrierPage.showView === VIEWS.DETAILS && (
                  <>
                    <GovUK.Heading size={'L'} mb={2}>
                      {t(
                        'exportJourney.wasteCarrierTransport.descriptionTitle',
                        {
                          type: t(
                            `exportJourney.wasteCarrierTransport.${transportType}`
                          ).toLowerCase(),
                          carrierIndex: t(
                            `numberAdjective.${carrierIndex + 1}`
                          ),
                        }
                      )}
                    </GovUK.Heading>
                    <Paragraph>
                      {t(
                        'exportJourney.wasteCarrierTransport.descriptionHintIntro'
                      )}
                    </Paragraph>
                    <GovUK.UnorderedList>{printBullets()}</GovUK.UnorderedList>
                    <form onSubmit={handleSubmit}>
                      <TextareaCharCount
                        id="description"
                        name="description"
                        onChange={(e) =>
                          setTransportDescription(e.target.value)
                        }
                        errorMessage={errors?.transportDescriptionError}
                        charCount={200}
                        rows={4}
                        value={transportDescription}
                      >
                        <GovUK.LabelText>
                          {t(
                            'exportJourney.wasteCarrierTransport.enterDetails'
                          )}
                        </GovUK.LabelText>
                      </TextareaCharCount>
                      <ButtonGroup>
                        <GovUK.Button id="saveButton">
                          {t('saveButton')}
                        </GovUK.Button>
                        <SaveReturnButton onClick={handleLinkSubmit} />
                      </ButtonGroup>
                    </form>
                  </>
                )}
              </>
            )}
          </GovUK.GridCol>
        </GovUK.GridRow>
      </GovUK.Page>
    </>
  );
};

export default CarrierTransportMeans;
