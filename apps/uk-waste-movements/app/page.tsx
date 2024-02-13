import * as GovUK from '@wts/ui/govuk-react-ui';

export const metadata = {
  title: 'UK waste movements',
};

export default async function Index() {
  return (
    <>
      <GovUK.GridRow>
        <GovUK.GridCol size={'two-thirds'}>
          <GovUK.Heading size={'l'} level={1}>
            Sign into your Defra waste tracking service account
          </GovUK.Heading>
          <GovUK.Paragraph size={'l'}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
          </GovUK.Paragraph>
          <GovUK.Paragraph>You can use this service to:</GovUK.Paragraph>
          <GovUK.List type="unordered">
            <GovUK.ListItem>one</GovUK.ListItem>
            <GovUK.ListItem>two</GovUK.ListItem>
            <GovUK.ListItem>one</GovUK.ListItem>
            <GovUK.ListItem>two</GovUK.ListItem>
          </GovUK.List>
          <GovUK.Button start={true} text="Start now" />
          <GovUK.Heading size={'m'} level={2}>
            Before you start
          </GovUK.Heading>
          <GovUK.Paragraph>
            Before you can use the waste tracking service, you must
          </GovUK.Paragraph>
          <GovUK.List type={'ordered'}>
            <GovUK.ListItem>a iaculis at erat pellentesque</GovUK.ListItem>
            <GovUK.ListItem>
              condimentum mattis pellentesque id nibh
            </GovUK.ListItem>
          </GovUK.List>
          <GovUK.Paragraph>
            Before you can use the waste tracking service, you must
          </GovUK.Paragraph>
          <GovUK.List type={'unordered'}>
            <GovUK.ListItem>one</GovUK.ListItem>
            <GovUK.ListItem>two</GovUK.ListItem>
          </GovUK.List>
          <GovUK.InsetText>Some inset text</GovUK.InsetText>
          <GovUK.Paragraph>And another paragraph</GovUK.Paragraph>
          <GovUK.Heading size={'m'} level={3}>
            Check UK waste movement controls
          </GovUK.Heading>
          <GovUK.Paragraph>test paragraph</GovUK.Paragraph>
          <GovUK.Heading size={'m'} level={3}>
            Check export controls
          </GovUK.Heading>
          <GovUK.Paragraph>test paragraph</GovUK.Paragraph>
          <GovUK.Paragraph>
            Check regulatory controls that apply when you:
          </GovUK.Paragraph>
          <GovUK.List type="unordered">
            <GovUK.ListItem>
              <GovUK.Link href="#">link1</GovUK.Link>
            </GovUK.ListItem>
            <GovUK.ListItem>
              <GovUK.Link href="#">link1</GovUK.Link>
            </GovUK.ListItem>
            <GovUK.ListItem>
              <GovUK.Link href="#">link1</GovUK.Link>
            </GovUK.ListItem>
            <GovUK.ListItem>
              <GovUK.Link href="#">link1</GovUK.Link>
            </GovUK.ListItem>
          </GovUK.List>
          <GovUK.Heading size={'m'} level={3}>
            Get help with a technical issue
          </GovUK.Heading>
          <GovUK.Paragraph>test paragraph</GovUK.Paragraph>
          <GovUK.Paragraph>
            Check regulatory controls that apply when you:
          </GovUK.Paragraph>
          <GovUK.Heading size={'m'} level={3}>
            Get help with a regulatory issue
          </GovUK.Heading>
          <GovUK.Paragraph>test paragraph</GovUK.Paragraph>
          <GovUK.Paragraph>
            Check regulatory controls that apply when you:
          </GovUK.Paragraph>
          <GovUK.List type="unordered">
            <GovUK.ListItem>
              <GovUK.Link href="#">link1</GovUK.Link>
            </GovUK.ListItem>
            <GovUK.ListItem>
              <GovUK.Link href="#">link1</GovUK.Link>
            </GovUK.ListItem>
            <GovUK.ListItem>
              <GovUK.Link href="#">link1</GovUK.Link>
            </GovUK.ListItem>
            <GovUK.ListItem>
              <GovUK.Link href="#">link1</GovUK.Link>
            </GovUK.ListItem>
          </GovUK.List>
        </GovUK.GridCol>
      </GovUK.GridRow>
    </>
  );
}
