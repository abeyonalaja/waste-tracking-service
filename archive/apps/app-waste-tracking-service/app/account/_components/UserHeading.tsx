import { getServerSession } from 'next-auth';
import * as GovUK from '@wts/ui/govuk-react-ui';

export default async function UserHeading(): Promise<JSX.Element> {
  const session = await getServerSession();

  return (
    <GovUK.Heading size={'l'} level={1}>
      {session?.user?.name}
    </GovUK.Heading>
  );
}
