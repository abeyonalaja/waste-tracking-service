import { Page, Loading } from '@wts/ui/shared-ui/server';

export default function LoadingPage(): React.ReactNode {
  return (
    <Page>
      <Loading centered={true} />
    </Page>
  );
}
