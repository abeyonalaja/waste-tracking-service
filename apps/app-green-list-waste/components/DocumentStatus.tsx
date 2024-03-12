import React from 'react';
import { Tag } from 'govuk-react';
import { useTranslation } from 'react-i18next';

export const DocumentStatus = (props) => {
  const { t } = useTranslation();
  const { status } = props;
  let name;
  switch (status) {
    case 'CannotStart':
      name = (
        <Tag
          id={props.id}
          data-testid={`CST${props.id ? `-${props.id}` : ''}`}
          tint="GREY"
        >
          {t('status.cannotStartYet')}
        </Tag>
      );
      break;
    case 'NotStarted':
      name = (
        <Tag
          id={props.id}
          data-testid={`NS${props.id ? `-${props.id}` : ''}`}
          tint="GREY"
        >
          {t('status.notStarted')}
        </Tag>
      );
      break;
    case 'Started':
      name = (
        <Tag
          id={props.id}
          data-testid={`IP${props.id ? `-${props.id}` : ''}`}
          tint="BLUE"
        >
          {t('status.inProgress')}
        </Tag>
      );
      break;
    case 'Complete':
      name = (
        <Tag id={props.id} data-testid={`C${props.id ? `-${props.id}` : ''}`}>
          {t('status.completed')}
        </Tag>
      );
      break;
    default:
      name = (
        <Tag id={props.id} tint="GREY">
          {t('status.notStarted')}
        </Tag>
      );
      break;
  }
  return name;
};
