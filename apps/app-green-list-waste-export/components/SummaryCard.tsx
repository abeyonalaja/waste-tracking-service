import React, { ReactNode } from 'react';
import styled from 'styled-components';
import { BORDER_COLOUR, GREY_3 } from 'govuk-colours';
import { AppLink } from './index';

interface SummaryCardAction {
  label: string | ReactNode;
  action: (action) => void;
  hidden?: boolean;
}

interface Props {
  title: string;
  children: ReactNode;
  id?: string;
  actions?: Array<SummaryCardAction>;
}

const SumCard = styled.div`
  border: 1px solid ${BORDER_COLOUR};
  margin-bottom: 20px;
  @media (min-width: 40.0625em) {
  }
`;

const SumCardTitleWrap = styled.div`
  padding: 15px;
  background: ${GREY_3};
  border-bottom: 1px solid rgba(0, 0, 0, 0);
  @media (min-width: 40.0625em) {
    display: flex;
    justify-content: space-between;
    flex-wrap: nowrap;
    padding: 15px 20px;
  }
`;

const SumCardTitle = styled.h2`
  font-weight: 700;
  font-size: 16px;
  line-height: 1.25;
  margin: 5px 20px 10px 0;
  @media (min-width: 40.0625em) {
    font-size: 19px;
    line-height: 1.3;
    margin-bottom: 5px;
  }
  &:first-letter {
    text-transform: uppercase;
  }
`;

const SumCardContent = styled.div`
  padding: 15px;
  @media (min-width: 40.0625em) {
    padding: 15px 20px;
  }
`;

const ActionsList = styled.ul`
  font-weight: 700;
  font-size: 16px;
  line-height: 1.25;
  display: flex;
  flex-wrap: wrap;
  row-gap: 10px;
  margin: 5px 0;
  padding: 0;
  list-style: none;
  @media (min-width: 40.0625em) {
    justify-content: right;
    text-align: right;
  }
`;

const ActionsListItem = styled.li`
  display: inline;
  margin: 0 10px 0 0;
  padding-right: 10px;
  border-right: 1px solid ${BORDER_COLOUR};
  @media (min-width: 40.0625em) {
    margin-right: 0;
  }
  &:last-child {
    margin: 0;
    padding-right: 0;
    border-right: none;
    @media (min-width: 40.0625em) {
      padding-left: 10px;
    }
  }
`;
export const SummaryCard = ({
  title,
  children,
  id,
  actions,
}: Props): React.ReactNode => {
  return (
    <SumCard id={id}>
      <SumCardTitleWrap id={`${id}-header`}>
        <SumCardTitle id={`${id}-title`}>{title}</SumCardTitle>
        {actions && (
          <ActionsList>
            {actions.map((action, index) => {
              return (
                !action.hidden && (
                  <ActionsListItem key={index}>
                    <AppLink
                      href="#"
                      isBold={true}
                      onClick={action.action}
                      id={`${id}-link-${index}`}
                    >
                      {action.label}
                    </AppLink>
                  </ActionsListItem>
                )
              );
            })}
          </ActionsList>
        )}
      </SumCardTitleWrap>
      <SumCardContent id={`${id}-content`}>{children}</SumCardContent>
    </SumCard>
  );
};
