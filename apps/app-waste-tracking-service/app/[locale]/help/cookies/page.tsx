import * as GovUK from '@wts/ui/govuk-react-ui';

export const metadata = {
  title: 'Cookies',
};

export default async function Index(): Promise<JSX.Element> {
  return (
    <>
      <GovUK.GridRow>
        <GovUK.GridCol size={'two-thirds'}>
          <GovUK.Heading size={'l'} level={1}>
            Cookies
          </GovUK.Heading>
        </GovUK.GridCol>
      </GovUK.GridRow>
    </>
  );
}
