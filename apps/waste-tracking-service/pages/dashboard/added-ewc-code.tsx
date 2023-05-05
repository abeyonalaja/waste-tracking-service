import React, { useState, useEffect, useReducer, FormEvent } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import * as GovUK from 'govuk-react';
import '../../i18n/config';
import { useTranslation } from 'react-i18next';
import {
  AppLink,
  CompleteFooter,
  CompleteHeader,
  BreadcrumbWrap,
  SaveReturnLink,
} from '../../components';
import { GetWasteDescriptionResponse } from '@wts/api/waste-tracking-gateway';

type State = {
  data: GetWasteDescriptionResponse;
  isLoading: boolean;
  isError: boolean;
  isReadyToUpdate: boolean;
  showView: number;
};

type Action = {
  type:
    | 'DATA_FETCH_INIT'
    | 'DATA_FETCH_SUCCESS'
    | 'DATA_FETCH_FAILURE'
    | 'DATA_UPDATED_SUCCESS'
    | 'SHOW_VIEW'
    | 'REMOVE_EWC_CODE';
  payload?: any;
};

const VIEWS = {
  LIST: 1,
  CONFIRM: 2,
};

const initialState: State = {
  data: { status: 'Started' },
  isLoading: true,
  isError: false,
  isReadyToUpdate: false,
  showView: VIEWS.LIST,
};

const ewcCodesReducer = (state: State, action: Action) => {
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
    case 'DATA_UPDATED_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isError: false,
        isReadyToUpdate: false,
        showView: VIEWS.LIST,
      };
    case 'SHOW_VIEW':
      return {
        ...state,
        isLoading: false,
        isError: false,
        isReadyToUpdate: false,
        showView: action.payload,
      };
    case 'REMOVE_EWC_CODE':
      if (state.data.status === 'Started') {
        return {
          ...state,
          isReadyToUpdate: true,
          data: {
            ...state.data,
            ewcCodes: state.data.ewcCodes.filter(
              (item) => action.payload !== item
            ),
          },
        };
      }
      return state;
    default:
      throw new Error();
  }
};

const EwcCodeList = () => {
  const { t } = useTranslation();
  const router = useRouter();

  const [ewcCodesPage, dispatchEwcCodesPage] = useReducer(
    ewcCodesReducer,
    initialState
  );

  const [id, setId] = useState(null);
  const [item, setItem] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [addAnother, setAddAnother] = useState(null);

  useEffect(() => {
    if (router.isReady) {
      setId(router.query.id);
    }
  }, [router.isReady, router.query.id]);

  useEffect(() => {
    dispatchEwcCodesPage({ type: 'DATA_FETCH_INIT' });
    if (id !== null) {
      fetch(
        `${process.env.NX_API_GATEWAY_URL}/submissions/${id}/waste-description`
      )
        .then((response) => {
          if (response.ok) return response.json();
          else {
            dispatchEwcCodesPage({ type: 'DATA_FETCH_FAILURE' });
          }
        })
        .then((data) => {
          if (data !== undefined) {
            dispatchEwcCodesPage({
              type: 'DATA_FETCH_SUCCESS',
              payload: data,
            });
          }
        });
    }
  }, [router.isReady, id]);

  const handleRemove = (ewccode) => {
    setItem(ewccode);
    dispatchEwcCodesPage({
      type: 'SHOW_VIEW',
      payload: VIEWS.CONFIRM,
    });
  };

  const handleConfirmSubmit = (e: FormEvent) => {
    if (confirm === 'no') {
      dispatchEwcCodesPage({
        type: 'SHOW_VIEW',
        payload: VIEWS.LIST,
      });
      setConfirm(null);
    }
    if (confirm === 'yes') {
      dispatchEwcCodesPage({
        type: 'REMOVE_EWC_CODE',
        payload: item,
      });
      setConfirm(null);
    }
    e.preventDefault();
  };

  const handleAddAnotherEWC = (e: FormEvent) => {
    if (addAnother === 'yes') {
      router.push({
        pathname: '/dashboard/enter-ewc-code',
        query: { id },
      });
      setAddAnother(null);
    } else {
      setAddAnother(null);
      router.push({
        pathname: '/national-code',
        query: { id },
      });
    }
    setAddAnother(null);
    e.preventDefault();
  };

  useEffect(() => {
    if (ewcCodesPage.isReadyToUpdate) {
      try {
        fetch(
          `${process.env.NX_API_GATEWAY_URL}/submissions/${id}/waste-description`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(ewcCodesPage.data),
          }
        )
          .then((response) => {
            if (response.ok) return response.json();
          })
          .then((data) => {
            if (data !== undefined) {
              dispatchEwcCodesPage({ type: 'DATA_UPDATED_SUCCESS' });
            }
          });
      } catch (e) {
        console.error(e);
      }
    }
  }, [ewcCodesPage.isReadyToUpdate]);

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
        <title>{t('yourReference.title')}</title>
      </Head>
      <GovUK.Page
        id="content"
        header={<CompleteHeader />}
        footer={<CompleteFooter />}
        beforeChildren={<BreadCrumbs />}
      >
        <GovUK.GridRow>
          <GovUK.GridCol setWidth="two-thirds">
            {ewcCodesPage.isError && !ewcCodesPage.isLoading && (
              <p>No valid record found</p>
            )}
            {ewcCodesPage.isLoading && <p>Loading</p>}
            {!ewcCodesPage.isError &&
              !ewcCodesPage.isLoading &&
              ewcCodesPage.data.status === 'Started' && (
                <>
                  {ewcCodesPage.showView === VIEWS.LIST ? (
                    <>
                      <GovUK.Heading size="LARGE">
                        {t('exportJourney.addedEwcCode.title', {
                          n: ewcCodesPage.data.ewcCodes?.length || 0,
                        })}
                      </GovUK.Heading>
                      <GovUK.Table>
                        {ewcCodesPage.data.ewcCodes?.map((item, index) => (
                          <GovUK.Table.Row key={index}>
                            <GovUK.Table.CellHeader>
                              {item}
                            </GovUK.Table.CellHeader>
                            <GovUK.Table.Cell>
                              <AppLink
                                href="#"
                                onClick={() => handleRemove(item)}
                              >
                                {t('exportJourney.addedEwcCode.remove')}
                                <GovUK.VisuallyHidden>
                                  {' '}
                                  {item}
                                </GovUK.VisuallyHidden>
                              </AppLink>
                            </GovUK.Table.Cell>
                          </GovUK.Table.Row>
                        ))}
                      </GovUK.Table>
                      {ewcCodesPage.data.ewcCodes?.length >= 5 ? (
                        <>
                          <GovUK.Button
                            id="saveButton"
                            onClick={() => {
                              router.push({
                                pathname: '/national-code',
                                query: { id },
                              });
                            }}
                          >
                            {t('saveButton')}
                          </GovUK.Button>
                          <SaveReturnLink
                            data-testid="saveAndReturnLink2"
                            href="#"
                            onClick={() => {
                              router.push({
                                pathname: '/submit-an-export-tasklist',
                                query: { id },
                              });
                            }}
                          />
                        </>
                      ) : (
                        <form onSubmit={handleAddAnotherEWC}>
                          <GovUK.Fieldset>
                            <GovUK.Fieldset.Legend size="MEDIUM">
                              {t('exportJourney.addedEwcCode.question')}
                            </GovUK.Fieldset.Legend>
                          </GovUK.Fieldset>
                          <GovUK.FormGroup>
                            <GovUK.MultiChoice label="">
                              <GovUK.Radio
                                inline
                                name="add-another-ewc-code"
                                onChange={() => setAddAnother('yes')}
                                checked={addAnother === 'yes'}
                              >
                                {t('radio.yes')}
                              </GovUK.Radio>
                              <GovUK.Radio
                                inline
                                name="add-another-ewc-code"
                                onChange={() => setAddAnother('no')}
                                checked={addAnother === 'no'}
                              >
                                {t('radio.no')}
                              </GovUK.Radio>
                            </GovUK.MultiChoice>
                          </GovUK.FormGroup>
                          <GovUK.Button id="saveButton">
                            {t('saveButton')}
                          </GovUK.Button>
                          <SaveReturnLink
                            data-testid="saveAndReturnLink"
                            href={{
                              pathname: '/submit-an-export-tasklist',
                              query: { id },
                            }}
                          />
                        </form>
                      )}
                    </>
                  ) : null}
                  {ewcCodesPage.showView === VIEWS.CONFIRM ? (
                    <form onSubmit={handleConfirmSubmit}>
                      <GovUK.Fieldset>
                        <GovUK.Fieldset.Legend size="LARGE">
                          {t('exportJourney.addedEwcCode.delete')}
                        </GovUK.Fieldset.Legend>
                      </GovUK.Fieldset>
                      <GovUK.Paragraph>{item}</GovUK.Paragraph>
                      <GovUK.FormGroup>
                        <GovUK.MultiChoice label="">
                          <GovUK.Radio
                            inline
                            name="confirm-delete"
                            onChange={() => setConfirm('yes')}
                          >
                            {t('radio.yes')}
                          </GovUK.Radio>
                          <GovUK.Radio
                            inline
                            name="confirm-delete"
                            onChange={() => setConfirm('no')}
                          >
                            {t('radio.no')}
                          </GovUK.Radio>
                        </GovUK.MultiChoice>
                      </GovUK.FormGroup>
                      <GovUK.Button id="saveButton">
                        {t('saveButton')}
                      </GovUK.Button>
                    </form>
                  ) : null}
                </>
              )}
          </GovUK.GridCol>
        </GovUK.GridRow>
      </GovUK.Page>
    </>
  );
};

export default EwcCodeList;
