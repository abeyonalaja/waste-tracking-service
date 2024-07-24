import { useQuery } from '@tanstack/react-query';
import { format, differenceInDays } from 'date-fns';
import useApiConfig from 'utils/useApiConfig';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import * as GovUK from 'govuk-react';

export function ServiceChargeBanner(): React.ReactElement {
  const { t } = useTranslation();
  const apiConfig = useApiConfig();

  async function getServiceChargeStatus() {
    const url = `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/payments`;
    const headers = {
      Authorization: apiConfig.Authorization,
    };
    return await axios.get(url, { headers });
  }

  const { isPending, data, isError, error } = useQuery({
    queryKey: ['serviceCharge'],
    queryFn: getServiceChargeStatus,
  });

  if (isError) {
    console.error('Error fetching service charge', error);
    return;
  }

  if (isPending) {
    return;
  }

  if (data.data.serviceChargePaid === false) {
    return (
      <GovUK.GridRow>
        <GovUK.GridCol setWidth="two-thirds">
          <div
            className="govuk-notification-banner"
            role="region"
            aria-labelledby="govuk-notification-banner-title"
            data-module="govuk-notification-banner"
          >
            <div className="govuk-notification-banner__header">
              <h2
                className="govuk-notification-banner__title"
                id="govuk-notification-banner-title"
              >
                {t('serviceChargeBanner.tag')}
              </h2>
            </div>
            <div className="govuk-notification-banner__content">
              <p className="govuk-notification-banner__heading">
                {t('serviceChargeBanner.one')}
                <GovUK.Link
                  noVisitedState={true}
                  className="govuk-notification-banner__link"
                  href="../service-charge/guidance"
                >
                  {t('serviceChargeBanner.link')}
                </GovUK.Link>
                {t('serviceChargeBanner.two')}
              </p>
            </div>
          </div>
        </GovUK.GridCol>
      </GovUK.GridRow>
    );
  }

  const formattedExpiryDate = format(
    new Date(data.data.expiryDate),
    'EEEE do MMMM yyyy',
  );

  const daysUntilExpiry = differenceInDays(
    new Date(data.data.expiryDate),
    new Date(),
  );

  if (daysUntilExpiry > 28) {
    return;
  } else {
    return (
      <GovUK.GridRow>
        <GovUK.GridCol setWidth="two-thirds">
          <div
            className="govuk-notification-banner"
            role="region"
            aria-labelledby="govuk-notification-banner-title"
            data-module="govuk-notification-banner"
          >
            <div className="govuk-notification-banner__header">
              <h2
                className="govuk-notification-banner__title"
                id="govuk-notification-banner-title"
              >
                {t('serviceChargeBanner.tag')}
              </h2>
            </div>
            <div className="govuk-notification-banner__content">
              <p className="govuk-notification-banner__heading">
                {t('serviceChargeRenewalBanner.text', {
                  date: formattedExpiryDate,
                })}
                <GovUK.Link
                  noVisitedState={true}
                  className="govuk-notification-banner__link"
                  href="../service-charge/guidance"
                >
                  {t('serviceChargeRenewalBanner.link')}
                </GovUK.Link>
              </p>
            </div>
          </div>
        </GovUK.GridCol>
      </GovUK.GridRow>
    );
  }
}
