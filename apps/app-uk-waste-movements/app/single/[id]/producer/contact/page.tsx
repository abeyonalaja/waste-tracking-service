import { Breadcrumbs } from '@wts/ui/shared-ui';
import * as GovUK from '@wts/ui/govuk-react-ui';
import { Page } from '@wts/ui/shared-ui/server';

export default function ContactPage(): JSX.Element {
  return (
    <Page
      beforeChildren={
        <Breadcrumbs items={[{ text: 'Back to tasklist', href: '../' }]} />
      }
    >
      <GovUK.GridRow>
        <GovUK.GridCol>
          <GovUK.Heading>Contact page</GovUK.Heading>
        </GovUK.GridCol>
      </GovUK.GridRow>
    </Page>
  );
}
