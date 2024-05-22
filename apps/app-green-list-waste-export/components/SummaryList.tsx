import React from 'react';
import styled from 'styled-components';
import { BORDER_COLOUR } from 'govuk-colours';

interface SummaryListItem {
  title: string;
  definition: string;
}

interface Props {
  content: Array<SummaryListItem>;
  id?: string;
}

const DefinitionList = styled('dl')`
  margin: 0;
  font-size: 16px;
  line-height: 1.25;
  @media (min-width: 40.0625em) {
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
  &:last-child {
    border-bottom: none;
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
    margin-bottom: 5px;
    width: 30%;
  }
`;

const Definition = styled('dd')`
  margin: 0 0 15px;
  font-weight: 400;
  word-wrap: break-word;
  overflow-wrap: break-word;
  @media (min-width: 40.0625em) {
    display: table-cell;
    padding-top: 10px;
    padding-right: 0;
    padding-bottom: 10px;
    margin: 0;
  }
`;

const idify = (value) => {
  return value.replace(/\W/g, '-').toLowerCase();
};

export const SummaryList = ({ content, id }: Props) => {
  return (
    <DefinitionList id={id}>
      {content.map((listItem, index) => {
        return (
          <Row key={index}>
            <Title id={`${id}-${index}-${idify(listItem.title)}`}>
              {listItem.title}
            </Title>
            <Definition id={`${id}-${index}-definition`}>
              {listItem.definition}
            </Definition>
          </Row>
        );
      })}
    </DefinitionList>
  );
};
