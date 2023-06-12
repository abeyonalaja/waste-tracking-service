import React from 'react';
import '../i18n/config';
import { useTranslation } from 'react-i18next';

export const WasteCarrierHeadingNoCaps = ({
  index,
  noOfCarriers,
  pageType,
}) => {
  const { t } = useTranslation();
  let itemName;
  if (pageType === 'firstPage') {
    if (
      noOfCarriers === 1 ||
      noOfCarriers === undefined ||
      index === undefined
    ) {
      itemName = t('exportJourney.wasteCarrierDetails.firstPageQuestion');
    } else if (noOfCarriers >= 1) {
      if (index === 0) {
        itemName = t('exportJourney.wasteCarrierDetails.firstPageQuestion1');
      } else if (index === 1) {
        itemName = t('exportJourney.wasteCarrierDetails.firstPageQuestion2');
      } else if (index === 2) {
        itemName = t('exportJourney.wasteCarrierDetails.firstPageQuestion3');
      } else if (index === 3) {
        itemName = t('exportJourney.wasteCarrierDetails.firstPageQuestion4');
      } else if (index === 4) {
        itemName = t('exportJourney.wasteCarrierDetails.firstPageQuestion5');
      }
    }
  }

  if (pageType === 'secondPage') {
    if (
      noOfCarriers === 1 ||
      noOfCarriers === undefined ||
      index === undefined
    ) {
      itemName = t('exportJourney.wasteCarrierDetails.secondPageQuestion');
    } else if (noOfCarriers >= 1) {
      if (index === 0) {
        itemName = t('exportJourney.wasteCarrierDetails.secondPageQuestion1');
      } else if (index === 1) {
        itemName = t('exportJourney.wasteCarrierDetails.secondPageQuestion2');
      } else if (index === 2) {
        itemName = t('exportJourney.wasteCarrierDetails.secondPageQuestion3');
      } else if (index === 3) {
        itemName = t('exportJourney.wasteCarrierDetails.secondPageQuestion4');
      } else if (index === 4) {
        itemName = t('exportJourney.wasteCarrierDetails.secondPageQuestion5');
      }
    }
  }

  if (pageType === 'thirdPage') {
    if (
      noOfCarriers === 1 ||
      noOfCarriers === undefined ||
      index === undefined
    ) {
      itemName = t('exportJourney.wasteCarrierTransport.pageQuestion');
    } else if (noOfCarriers >= 1) {
      if (index === 0) {
        itemName = t('exportJourney.wasteCarrierTransport.pageQuestion1');
      } else if (index === 1) {
        itemName = t('exportJourney.wasteCarrierTransport.pageQuestion2');
      } else if (index === 2) {
        itemName = t('exportJourney.wasteCarrierTransport.pageQuestion3');
      } else if (index === 3) {
        itemName = t('exportJourney.wasteCarrierTransport.pageQuestion4');
      } else if (index === 4) {
        itemName = t('exportJourney.wasteCarrierTransport.pageQuestion5');
      }
    }
  }

  return <>{itemName}</>;
};
