import { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import { Page } from '@wts/ui/shared-ui/server';
import { Breadcrumbs } from '@wts/ui/shared-ui';

export const metadata: Metadata = {
  title: 'Creating multiple waste movements',
  description: 'Creating multiple waste movements',
};

export default function ManageSubmissionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = useTranslations('multiples.manage');

  const breadcrumbs = [
    { text: t('breadCrumbs.home'), href: '../../account' },
    { text: t('breadCrumbs.moveWaste'), href: '/' },
    { text: t('breadCrumbs.current') },
  ];

  return (
    <Page beforeChildren={<Breadcrumbs items={breadcrumbs} />}>{children}</Page>
  );
}
