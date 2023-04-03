import React from 'react';
import { Tag } from 'govuk-react';

function DocumentStatus(props) {
  const status = props.status;

  let name;

  switch (status) {
    case 'CannotStart':
      name = (
        <Tag id={props.id} data-testid="CST" tint="GREY">
          CANNOT START YET
        </Tag>
      );
      break;
    case 'NotStarted':
      name = (
        <Tag id={props.id} data-testid="NS" tint="GREY">
          NOT STARTED
        </Tag>
      );
      break;
    case 'InProgress':
      name = (
        <Tag id={props.id} data-testid="NS" tint="BLUE">
          IN PROGRESS
        </Tag>
      );
      break;
    case 'Completed':
      name = (
        <Tag id={props.id} data-testid="C">
          COMPLETED
        </Tag>
      );
      break;
    default:
      name = (
        <Tag id={props.id} tint="GREY">
          NOT STARTED
        </Tag>
      );
      break;
  }

  return <>{name}</>;
}

export default DocumentStatus;
