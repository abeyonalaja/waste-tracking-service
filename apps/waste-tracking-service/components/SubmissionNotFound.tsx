import React from 'react';
import { Heading } from 'govuk-react';
import { AppLink, Paragraph } from './index';

interface Props {
  testId?: string;
}

export const SubmissionNotFound = ({ testId }: Props) => {
  return (
    <div data-testid={testId}>
      <Heading size="L">Not found</Heading>
      <Paragraph>The export record has not been found</Paragraph>
      <AppLink href="/dashboard">Return to the overview</AppLink>
    </div>
  );
};
