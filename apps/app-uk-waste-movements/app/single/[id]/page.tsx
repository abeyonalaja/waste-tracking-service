import Link from 'next/link';
import * as GovUK from '@wts/ui/govuk-react-ui';
import { Page } from '@wts/ui/shared-ui/server';
import { BackLink } from '@wts/ui/shared-ui';

interface PageProps {
  params: {
    id: string;
  };
}

export default function TaskListPage({ params }: PageProps): React.ReactNode {
  return (
    <Page beforeChildren={<BackLink href={'../'} />}>
      <GovUK.GridRow>
        <GovUK.GridCol size="two-thirds">
          <GovUK.Caption>{params.id}</GovUK.Caption>
          <GovUK.Heading>Task list</GovUK.Heading>
          <Link
            href={`/single/${params.id}/producer/address`}
            id="tasklist-link-producer-address"
          >
            Producer organisation address
          </Link>
        </GovUK.GridCol>
      </GovUK.GridRow>
    </Page>
  );
}
