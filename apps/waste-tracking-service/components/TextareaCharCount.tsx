import React, { ReactNode, useState } from 'react';
import { Label, FormGroup, TextArea, HintText } from 'govuk-react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

interface Props {
  id: string;
  name: string;
  hint?: string;
  rows?: number;
  charCount?: number;
  value?: string;
  errorMessage?: string;
  onChange?: (input) => void;
  children?: ReactNode;
  testId?: string;
}

interface HintProps {
  readonly error: boolean;
}

const StyledHint = styled(HintText)<HintProps>`
  margin-top: 5px;
  color: ${(props) => (props.error ? '#d4351c' : '#6f777b')};
`;

export const TextareaCharCount = ({
  id,
  name,
  hint,
  rows = 5,
  charCount = 100,
  value,
  errorMessage,
  onChange,
  children,
  testId,
}: Props) => {
  const [count, setCount] = useState(value?.length || 0);
  const [error, setError] = useState(false);
  const { t } = useTranslation();
  const handleChange = (e) => {
    if (typeof onChange == 'function') {
      onChange(e);
    }
    setCount(e.target.value.length);
    setError(e.target.value.length > charCount);
  };
  let message =
    count > charCount
      ? t('charsCount.negative', { n: count - charCount })
      : t('charsCount.positive', { n: charCount - count });
  if (count - charCount === 1) message = t('charCount.negative');
  if (count - charCount === -1) message = t('charCount.positive');
  return (
    <>
      <FormGroup>
        <Label htmlFor={id}>{children}</Label>
        <TextArea
          data-testid={testId}
          hint={hint}
          meta={{
            error: errorMessage,
            touched: !!errorMessage,
          }}
          input={{
            id: id,
            name: name,
            rows: rows,
            value: value,
            onChange: handleChange,
          }}
        >
          {}
        </TextArea>
        <StyledHint error={error} id={`${id}-character-remaining-text`}>
          {message}
        </StyledHint>
      </FormGroup>
    </>
  );
};
