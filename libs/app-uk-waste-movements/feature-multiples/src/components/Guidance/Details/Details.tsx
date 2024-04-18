import * as GovUK from '@wts/ui/govuk-react-ui';
import { useTranslations } from 'next-intl';
import { Link as LocaleLink } from '@wts/ui/navigation';
export function Details() {
  const page = useTranslations('multiples.guidancePage');

  return (
    <>
      <GovUK.Heading size="m" level={2} id="details">
        {page('details.heading')}
      </GovUK.Heading>
      <GovUK.Paragraph>
        {page('details.content', {
          serviceURL: 'waste tracking service',
        })}
      </GovUK.Paragraph>
      <GovUK.Paragraph>{page('details.listInfo')}</GovUK.Paragraph>
      <GovUK.List type="unordered">
        <GovUK.ListItem>
          <span>{page('details.listItemOne')}</span>
        </GovUK.ListItem>
        <GovUK.ListItem>
          <span>{page('details.listItemTwo')}</span>
        </GovUK.ListItem>
        <GovUK.ListItem>
          <span>{page('details.listItemThree')}</span>
        </GovUK.ListItem>
        <GovUK.SectionBreak size="m" visible={false} />
      </GovUK.List>
      <GovUK.Paragraph>{page('details.outro')}</GovUK.Paragraph>
      <GovUK.Heading size="s" level={3}>
        {page('details.multiple.heading')}
      </GovUK.Heading>
      <GovUK.Paragraph>{page('details.multiple.contentOne')}</GovUK.Paragraph>
      <GovUK.Paragraph>{page('details.multiple.contentTwo')}</GovUK.Paragraph>
      <GovUK.SectionBreak size="m" visible={false} />
      <GovUK.Heading size="s" level={3}>
        {page('details.technicalIssue.heading')}
      </GovUK.Heading>
      <GovUK.Paragraph>
        {page('details.technicalIssue.contentOne')}
      </GovUK.Paragraph>
      <GovUK.List type="unordered">
        <GovUK.ListItem>
          <span>{page('details.technicalIssue.listItemOne')}</span>
        </GovUK.ListItem>
        <GovUK.ListItem>
          <span>{page('details.technicalIssue.listItemTwo')}</span>
        </GovUK.ListItem>
        <GovUK.SectionBreak size="m" visible={false} />
      </GovUK.List>
      <GovUK.Paragraph>
        {page('details.technicalIssue.contentTwo')}
        <LocaleLink href={`mailto:${page('details.technicalIssue.email')}`}>
          {page('details.technicalIssue.email')}
        </LocaleLink>
        .
      </GovUK.Paragraph>
      <GovUK.SectionBreak size="m" visible={false} />
      <GovUK.Heading size="s" level={3}>
        {page('details.regulatoryIssue.heading')}
      </GovUK.Heading>
      <GovUK.Paragraph>
        {page('details.regulatoryIssue.contentOne')}
      </GovUK.Paragraph>
      <GovUK.Paragraph>
        {page('details.regulatoryIssue.contentTwo')}
      </GovUK.Paragraph>
    </>
  );
}
