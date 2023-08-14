import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { SubmissionNotFound } from 'components';

test('renders Submission Not Found component', () => {
  const { getByTestId, getByText } = render(
    <SubmissionNotFound testId="submission-not-found" />
  );

  expect(getByText('Not found')).toBeInTheDocument();
  expect(getByText('The export record has not been found')).toBeInTheDocument();
  expect(getByText('Return to the overview')).toBeInTheDocument();
  expect(getByTestId('submission-not-found')).toBeInTheDocument();
});
