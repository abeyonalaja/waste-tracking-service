import * as GovUK from '@wts/ui/govuk-react-ui';
import { useTranslations } from 'next-intl';
import { Link as LocaleLink } from '@wts/ui/navigation';
export function Content(): React.ReactNode {
  const page = useTranslations('multiples.guidancePage');

  return (
    <>
      <GovUK.List type="unordered">
        <GovUK.ListItem>
          <LocaleLink href="#details">{page('content.linkOne')}</LocaleLink>
        </GovUK.ListItem>
        <GovUK.ListItem>
          <LocaleLink href="#yourUniqueReference">
            {page('content.linkTwo')}
          </LocaleLink>
        </GovUK.ListItem>
        <GovUK.ListItem>
          <LocaleLink href="#producerAndCollectionDetails">
            {page('content.linkThree')}
          </LocaleLink>
        </GovUK.ListItem>
        <GovUK.ListItem>
          <LocaleLink href="#collectionDetails">
            {page('content.linkFour')}
          </LocaleLink>
        </GovUK.ListItem>
        <GovUK.ListItem>
          <LocaleLink href="#receiverDetails">
            {page('content.linkFive')}
          </LocaleLink>
        </GovUK.ListItem>
        <GovUK.ListItem>
          <LocaleLink href="#ewcCodesAndDescription">
            {page('content.linkSix')}
          </LocaleLink>
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
