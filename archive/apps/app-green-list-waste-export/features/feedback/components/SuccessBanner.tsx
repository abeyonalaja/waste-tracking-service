import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import { NotificationBanner, AppLink } from 'components';

interface SuccessBannerProps {
  newWindow: boolean;
}

export default function SuccessBanner({
  newWindow,
}: SuccessBannerProps): React.ReactNode {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <NotificationBanner
      headingLevel={1}
      type="success"
      headingText={t('feedback.success.bannerHeading')}
    >
      {newWindow ? (
        <AppLink colour={'green'} href="/" target="_self">
          {t('feedback.returnLink')}
        </AppLink>
      ) : (
        <AppLink
          colour={'green'}
          href="#"
          target="_self"
          onClick={(e) => {
            e.preventDefault();
            router.back();
          }}
        >
          {t('feedback.backLink')}
        </AppLink>
      )}
    </NotificationBanner>
  );
}
