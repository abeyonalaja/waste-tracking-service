import React from 'react';
import styled from 'styled-components';
import { BORDER_COLOUR } from 'govuk-colours';

interface Props {
  content: any;
  prefixNumbers?: boolean;
}

const DefinitionList = styled('dl')`
  margin-bottom: 20px;
  font-size: 16px;
  line-height: 1.25;
  @media (min-width: 40.0625em) {
    margin-bottom: 30px;
    display: table;
    width: 100%;
    table-layout: fixed;
    border-collapse: collapse;
    font-size: 19px;
    line-height: 1.35;
  }
`;

const Row = styled('div')`
  border-bottom: 1px solid ${BORDER_COLOUR};
  margin-bottom: 15px;
  @media (min-width: 40.0625em) {
    display: table-row;
  }
`;
const Title = styled('dt')`
  margin-bottom: 5px;
  font-weight: 700;
  @media (min-width: 40.0625em) {
    display: table-cell;
    padding-top: 10px;
    padding-right: 20px;
    padding-bottom: 10px;
    width: 30%;
  }
`;
export const SummaryList = ({ content, prefixNumbers }: Props) => {
  return (
    <DefinitionList>
      {content.map((title, index) => {
        return (
          <Row key={index}>
            <Title>
              {prefixNumbers ? `${index + 1}. ` : ''}
              {title}
            </Title>
          </Row>
        );
      })}
    </DefinitionList>
  );
};
