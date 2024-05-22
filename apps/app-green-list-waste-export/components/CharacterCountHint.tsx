import { HintText, ErrorText } from 'govuk-react';
import { useTranslation } from 'react-i18next';

interface CharacterCountHintProps {
  currentCount: number;
  maxCount: number;
  id: string;
}

export function CharacterCountHint({
  currentCount,
  maxCount,
  id,
}: CharacterCountHintProps) {
  const { t } = useTranslation();

  if (maxCount - currentCount >= 0) {
    return (
      <HintText id={id}>
        {t('charsCount.positive', { n: maxCount - currentCount })}
      </HintText>
    );
  }

  return (
    <ErrorText id={id}>
      {t('charsCount.negative', { n: Math.abs(maxCount - currentCount) })}
    </ErrorText>
  );
}
