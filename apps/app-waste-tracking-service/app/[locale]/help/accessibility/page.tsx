import * as GovUK from '@wts/ui/govuk-react-ui';
import { Page } from '@wts/ui/shared-ui/server';

export const metadata = {
  title: 'Accessibility',
};

export default async function Index(): Promise<JSX.Element> {
  return (
    <Page>
      <GovUK.GridRow>
        <GovUK.GridCol size={'two-thirds'}>
          <GovUK.Heading size={'l'} level={1}>
            Accessibility
          </GovUK.Heading>
        </GovUK.GridCol>
      </GovUK.GridRow>
    </Page>
  );
}
