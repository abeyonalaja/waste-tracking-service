import React, { ReactNode } from 'react';
import styled from 'styled-components';
import { BORDER_COLOUR, GREY_3 } from 'govuk-colours';

interface Props {
  title: string;
  children: ReactNode;
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
`;

const SumCardContent = styled.div`
  padding: 15px;
  @media (min-width: 40.0625em) {
    padding: 15px 20px;
  }
`;

export const SummaryCard = ({ title, children }: Props) => {
  return (
    <SumCard>
      <SumCardTitleWrap>
        <SumCardTitle>{title}</SumCardTitle>
      </SumCardTitleWrap>
      <SumCardContent>{children}</SumCardContent>
    </SumCard>
  );
};
