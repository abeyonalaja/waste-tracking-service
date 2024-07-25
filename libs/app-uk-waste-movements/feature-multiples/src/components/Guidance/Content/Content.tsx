import * as GovUK from '@wts/ui/govuk-react-ui';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
export function Content(): React.ReactNode {
  const page = useTranslations('multiples.guidancePage');

  return (
    <>
      <GovUK.List type="unordered">
        <GovUK.ListItem>
          <Link href="#details">{page('content.linkOne')}</Link>
        </GovUK.ListItem>
        <GovUK.ListItem>
          <Link href="#yourUniqueReference">{page('content.linkTwo')}</Link>
        </GovUK.ListItem>
        <GovUK.ListItem>
          <Link href="#producerAndCollectionDetails">
            {page('content.linkThree')}
          </Link>
        </GovUK.ListItem>
        <GovUK.ListItem>
          <Link href="#collectionDetails">{page('content.linkFour')}</Link>
        </GovUK.ListItem>
        <GovUK.ListItem>
          <Link href="#receiverDetails">{page('content.linkFive')}</Link>
        </GovUK.ListItem>
        <GovUK.ListItem>
          <Link href="#ewcCodesAndDescription">{page('content.linkSix')}</Link>
        </GovUK.ListItem>
      </GovUK.List>
      <GovUK.SectionBreak size="m" visible={false} />
      <GovUK.Heading size="m" level={2}>
        {' '}
        {page('documents.heading')}
      </GovUK.Heading>
      <GovUK.List type="unordered">
        <GovUK.ListItem>
          <a
            href={
              process.env['NODE_ENV'] === 'production'
                ? '/move-waste/downloads/multiple-movements-template.csv'
                : '/downloads/multiple-movements-template.csv'
            }
          >
            {page('documents.linkOne')}
          </a>
        </GovUK.ListItem>
      </GovUK.List>
      <GovUK.SectionBreak size="m" visible={false} />
    </>
  );
}
