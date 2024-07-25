import * as GovUK from '@wts/ui/govuk-react-ui';
import {
  FeedbackForm,
  FeedbackSuccessBanner,
  FeedbackError,
  FeedbackBackLink,
} from '@wts/app-uk-waste-movements/feature-feedback';
import { getTranslations } from 'next-intl/server';
import { Page } from '@wts/ui/shared-ui/server';
import { getServerSession } from 'next-auth/next';
import { options } from './../api/auth/[...nextauth]/options';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Give feedback on move waste in the UK service',
  description: 'Give feedback on move waste in the UK service',
};

export default async function Index({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}): Promise<JSX.Element> {
  const t = await getTranslations('feedbackPage');
  const session = await getServerSession(options);
  const token = session?.token;
  const formStrings = {
    headingOne: t('form.headingOne'),
    headingTwo: t('form.headingTwo'),

    ratingHeading: t('form.rating.heading'),
    ratingLabelOne: t('form.rating.labelOne'),
    ratingLabelTwo: t('form.rating.labelTwo'),
    ratingLabelThree: t('form.rating.labelThree'),
    ratingLabelFour: t('form.rating.labelFour'),
    ratingLabelFive: t('form.rating.labelFive'),
    textAreaHeading: t('form.textArea.heading'),
    textAreaHint: t('form.textArea.hint'),
    hintBottomPartOne: t('form.textArea.hintBottomPartOne'),
    hintBottomPartTwo: t('form.textArea.hintBottomPartTwo'),
    hintBottomExceeds: t('form.textArea.hintBottomExceeds'),
    errorTextAreaHeading: t('form.textArea.errorTextAreaHeading'),
    errorTextAreaDescription: t('form.textArea.errorTextAreaDescription'),
    errorTextArea: t('form.textArea.errorTextArea', { maxLength: 1200 }),
    submit: t('form.submitButton'),
  };

  const successStrings = {
    bannerTitle: t('successPage.bannerTitle'),
    bannerHeading: t('successPage.bannerHeading'),
    backLink: t('successPage.backLink'),
    backLinkNewWindow: t('successPage.backLinkNewWindow'),
  };

  const errorStrings = {
    heading: t('errorPage.heading'),
    paragraphOne: t('errorPage.paragraphOne'),
    paragraphTwo: t('errorPage.paragraphTwo'),
    backLink: t('errorPage.backLink'),
    backLinkNewWindow: t('errorPage.backLinkNewWindow'),
  };

  const backText = t('backText');

  return (
    <Page
      beforeChildren={
        <FeedbackBackLink text={backText} href="../" routerBack={true} />
      }
    >
      <GovUK.GridRow>
        <GovUK.GridCol size={'two-thirds'}>
          {searchParams.success === undefined && (
            <FeedbackForm token={token} strings={formStrings} />
          )}
          {searchParams.success === 'true' && (
            <FeedbackSuccessBanner strings={successStrings} />
          )}
          {searchParams.success === 'false' && (
            <FeedbackError strings={errorStrings} />
          )}
        </GovUK.GridCol>
      </GovUK.GridRow>
    </Page>
  );
}
