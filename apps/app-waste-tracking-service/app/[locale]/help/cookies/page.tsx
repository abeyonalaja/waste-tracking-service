import * as GovUK from 'govuk-react-ui';

export const metadata = {
  title: 'Cookies',
};

export default async function Index() {
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
