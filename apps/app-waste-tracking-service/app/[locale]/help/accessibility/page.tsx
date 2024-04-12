import * as GovUK from '@wts/ui/govuk-react-ui';

export const metadata = {
  title: 'Accessibility',
};

export default async function Index() {
  return (
    <>
      <GovUK.GridRow>
        <GovUK.GridCol size={'two-thirds'}>
          <GovUK.Heading size={'l'} level={1}>
            Accessibility
          </GovUK.Heading>
        </GovUK.GridCol>
      </GovUK.GridRow>
    </>
  );
}
