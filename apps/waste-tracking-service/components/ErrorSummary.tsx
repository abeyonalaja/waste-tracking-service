import * as React from 'react';
import styled from 'styled-components';

import { TEXT_COLOUR, ERROR_COLOUR, FOCUS_COLOUR } from 'govuk-colours';

import { H2 } from '@govuk-react/heading';
import Paragraph from '@govuk-react/paragraph';
import UnorderedList from '@govuk-react/unordered-list';
import ListItem from '@govuk-react/list-item';

import {
  BORDER_WIDTH,
  BORDER_WIDTH_MOBILE,
  FOCUS_WIDTH,
  MEDIA_QUERIES,
  RESPONSIVE_4,
} from '@govuk-react/constants';

import { spacing } from '@govuk-react/lib';
import { AppLink } from './AppLink';

const StyledErrorSummary = styled('div')(
  {
    color: TEXT_COLOUR,
    padding: RESPONSIVE_4.mobile,
    border: `${BORDER_WIDTH_MOBILE} solid ${ERROR_COLOUR}`,
    '&:focus': {
      outline: `${FOCUS_WIDTH} solid ${FOCUS_COLOUR}`,
      outlineOffset: '0',
    },
    [MEDIA_QUERIES.LARGESCREEN]: {
      padding: RESPONSIVE_4.tablet,
      border: `${BORDER_WIDTH} solid ${ERROR_COLOUR}`,
    },
  },
  spacing.withWhiteSpace({ marginBottom: 6 })
);

export interface ErrorSummaryProps {
  onHandleErrorClick?: (targetName: string, e?) => void;
  heading?: string;
  description?: string;
  errors?: {
    targetName?: string;
    text?: string;
  }[];
}

const handleJumpToError = (targetName: string, e?) => {
  e.preventDefault();
  const targetElement = document.querySelector(
    `[name="${targetName}"]`
  ) as HTMLInputElement;
  if (targetElement) {
    targetElement.focus();
  }
};

export const ErrorSummary: React.FC<ErrorSummaryProps> = ({
  heading = 'There is a problem',
  description = undefined,
  errors = [],
  onHandleErrorClick = handleJumpToError,
  ...props
}: ErrorSummaryProps) => {
  return (
    <StyledErrorSummary id="error-summary-box" tabIndex={-1} {...props}>
      <H2 size="MEDIUM">{heading}</H2>
      {description && <Paragraph mb={3}>{description}</Paragraph>}
      {errors.length > 0 && (
        <UnorderedList mb={0} listStyleType="none">
          {errors.map((error) => (
            <ListItem key={error.targetName}>
              <AppLink
                id={'error-link-' + error.targetName}
                href={'#'}
                isBold={true}
                colour={'red'}
                onClick={(e) => onHandleErrorClick(error.targetName, e)}
              >
                {error.text}
              </AppLink>
            </ListItem>
          ))}
        </UnorderedList>
      )}
    </StyledErrorSummary>
  );
};

ErrorSummary.displayName = 'ErrorSummary';

export default ErrorSummary;
