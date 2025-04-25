import * as GovUK from '@wts/ui/govuk-react-ui';
import { useTranslations } from 'next-intl';
export function CSVSummary(): React.ReactNode {
  const page = useTranslations('multiples.guidancePageCSV');

  return (
    <>
      <GovUK.Heading size="l">{page('heading')}</GovUK.Heading>
      <GovUK.Hint>{page('hint')}</GovUK.Hint>
      <GovUK.SectionBreak size="m" visible={false} />
      <GovUK.Paragraph>{page('contentOne')}</GovUK.Paragraph>
      <GovUK.Paragraph>{page('contentTwo')}</GovUK.Paragraph>
      <GovUK.List type="unordered">
        <GovUK.ListItem>
          <span>{page('listItemOne')}</span>
        </GovUK.ListItem>
        <GovUK.ListItem>
          <span>{page('listItemTwo')}</span>
        </GovUK.ListItem>
        <GovUK.ListItem>
          <span>{page('listItemThree')}</span>
        </GovUK.ListItem>
        <GovUK.ListItem>
          <span>{page('listItemFour')}</span>
        </GovUK.ListItem>
        <GovUK.ListItem>
          <span>{page('listItemFive')}</span>
        </GovUK.ListItem>
      </GovUK.List>
      <GovUK.SectionBreak size="m" visible={false} />
    </>
  );
}
