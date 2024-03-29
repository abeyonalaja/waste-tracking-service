import * as GovUK from '@wts/ui/govuk-react-ui';
import { getTranslations } from 'next-intl/server';
import SignInButton from './_components/SignInButton';
import { getServerSession } from 'next-auth';
import { redirect } from '../../../../../navigation';

export default async function Index({
  searchParams,
}: {
  searchParams: Record<string, string>;
}) {
  const t = await getTranslations('signinPage');
  const session = await getServerSession();

  if (session) {
    const { callbackUrl } = searchParams;
    redirect(callbackUrl ? callbackUrl.toString() : '/account');
  }

  return (
    <>
      <GovUK.GridRow>
        <GovUK.GridCol size={'two-thirds'}>
          <GovUK.Heading size={'l'} level={1}>
            {t('title')}
          </GovUK.Heading>
          <SignInButton label={t('button')} />
        </GovUK.GridCol>
      </GovUK.GridRow>
    </>
  );
}
