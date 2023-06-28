import React from 'react';
import { Tag } from 'govuk-react';
import '../i18n/config';
import { useTranslation } from 'react-i18next';

export const DocumentStatus = (props) => {
  const { t } = useTranslation();
  const { status } = props;
  let name;
  switch (status) {
    case 'CannotStart':
      name = (
        <Tag id={props.id} data-testid="CST" tint="GREY">
          {t('status.cannotStartYet')}
        </Tag>
      );
      break;
    case 'NotStarted':
      name = (
        <Tag id={props.id} data-testid="NS" tint="GREY">
          {t('status.notStarted')}
        </Tag>
      );
      break;
    case 'Started':
      name = (
        <Tag id={props.id} data-testid="IP" tint="BLUE">
          {t('status.inProgress')}
        </Tag>
      );
      break;
    case 'Complete':
      name = (
        <Tag id={props.id} data-testid="C">
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
