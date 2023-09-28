import React, { ReactNode } from 'react';
import styled from 'styled-components';
import { BORDER_COLOUR, GREY_3 } from 'govuk-colours';

type SummaryCardAction = {
  label: string | ReactNode;
  action: (action) => void;
  hidden?: boolean;
};

interface Props {
  title: string;
  children: ReactNode;
  id?: string;
  actions?: Array<SummaryCardAction>;
}

const CardBox = styled.div`
  border: 1px solid #e2e3e4;
  margin-bottom: 20px;
  @media (min-width: 40.0625em) {
    height: 100%;
    margin-bottom: 0;
  }
`;

const CardTitleWrap = styled.div`
  padding: 15px;
  background: ${GREY_3};
  border-bottom: 1px solid #e2e3e4;
  @media (min-width: 40.0625em) {
    padding: 20px;
  }
`;

const CardTitle = styled.h2`
  font-weight: 700;
  font-size: 19px;
  line-height: 1.25;
  margin: 0;
  @media (min-width: 40.0625em) {
    font-size: 24px;
    line-height: 1.3;
    margin-bottom: 1em;
  }
`;

const CardContent = styled.div`
  padding: 15px;
  @media (min-width: 40.0625em) {
    padding: 10px 20px 15px;
  }
  & > ul {
    margin-bottom: 0;
    & > li {
      margin-top: 10px;
    }
  }
`;

export const Card = ({ title, children, id }: Props) => {
  return (
    <CardBox id={id}>
      <CardTitleWrap id={`${id}-header`}>
        <CardTitle id={`${id}-title`}>{title}</CardTitle>
      </CardTitleWrap>
      <CardContent id={`${id}-content`}>{children}</CardContent>
    </CardBox>
  );
};
