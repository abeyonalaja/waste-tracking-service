import React from 'react';
import { Tag } from 'govuk-react';

export const DocumentStatus = (props) => {
  const { status } = props;
  let name;
  switch (status) {
    case 'CannotStart':
      name = (
        <Tag id={props.id} data-testid="CST" tint="GREY">
          Cannot start yet
        </Tag>
      );
      break;
    case 'NotStarted':
      name = (
        <Tag id={props.id} data-testid="NS" tint="GREY">
          Not started
        </Tag>
      );
      break;
    case 'Started':
      name = (
        <Tag id={props.id} data-testid="NS" tint="BLUE">
          In progress
        </Tag>
      );
      break;
    case 'Completed':
      name = (
        <Tag id={props.id} data-testid="C">
          Completed
        </Tag>
      );
      break;
    default:
      name = (
        <Tag id={props.id} tint="GREY">
          Not started
        </Tag>
      );
      break;
  }
  return name;
}
