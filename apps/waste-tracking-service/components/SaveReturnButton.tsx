import React, { FormEvent, ReactNode } from 'react';
import Button from '@govuk-react/button';
import { useTranslation } from 'react-i18next';

interface Props {
  onClick?: (e: FormEvent) => void;
  id?: string;
  testId?: string;
}

export const SaveReturnButton = ({ onClick, id, testId }: Props) => {
  const { t } = useTranslation();
  return (
    <Button
      id={id}
      onClick={onClick}
      buttonColour="#f3f2f1"
      buttonHoverColour="#dbdad9"
      buttonShadowColour="#929191"
      buttonTextColour="#0b0c0c"
      data-testid={testId}
    >
      {t('saveReturnButton')}
    </Button>
  );
};
