import { Loading as Loader } from '@wts/ui/shared-ui/server';
import { Page } from '@wts/ui/shared-ui/server';

export default function Loading(): JSX.Element {
  return (
    <Page>
      <Loader centered={true} />
    </Page>
  );
}
