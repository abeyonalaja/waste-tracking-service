import React from 'react';
import styled from 'styled-components';
import { BORDER_COLOUR } from 'govuk-colours';
import { AppLink } from './AppLink';

type SummaryListAction = {
  label: string;
  action: (action) => void;
};

interface Props {
  content: any;
  actions?: Array<SummaryListAction>;
  id?: string;
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
    margin-bottom: 5px;
    width: 50%;
  }
`;

const Actions = styled('dd')`
  margin: 10px 0 15px;
  @media (min-width: 40.0625em) {
    width: 50%;
    display: table-cell;
    padding-top: 10px;
    padding-bottom: 10px;
    margin-bottom: 5px;
    text-align: right;
  }
  a {
    margin-right: 10px;
    @media (min-width: 40.0625em) {
      margin: 0 0 0 15px;
    }
  }
`;

export const SummaryList = ({ content, actions, id, prefixNumbers }: Props) => {
  return (
    <DefinitionList id={id}>
      {content.map((title, index) => {
        return (
          <Row key={index}>
            <Title>
              {prefixNumbers ? `${index + 1}. ` : ''}
              {title}
            </Title>
            {actions?.length > 0 && (
              <Actions>
                {actions.map((action) => (
                  <AppLink
                    key={`action-${index}-${action.label.toLowerCase()}`}
                    href="#"
                    onClick={() => action.action(index)}
                  >
                    {action.label}
                  </AppLink>
                ))}
              </Actions>
            )}
          </Row>
        );
      })}
    </DefinitionList>
  );
};
