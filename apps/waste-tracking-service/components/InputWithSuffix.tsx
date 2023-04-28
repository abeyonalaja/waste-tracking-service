import React, { ChangeEvent } from 'react';
import styled from 'styled-components';
import {
  Input,
  HintText,
  Label,
  LabelText,
  VisuallyHidden,
  FormGroup,
  ErrorText,
} from 'govuk-react';

interface Props {
  id: string;
  name?: string;
  label: string;
  labelHidden?: boolean;
  suffix: string;
  hint?: string;
  value?: string | number;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  errorMessage?: string;
  testId?: string;
}

const StyledInputWrapper = styled.div`
  display: flex;
`;

const StyledInput = styled(Input)`
  flex: 0 1 auto;
  max-width: 5.5em;
`;

const StyledSuffix = styled.span`
  box-sizing: border-box;
  display: inline-block;
  min-width: 2.5rem;
  height: 2.5rem;
  padding: 5px 8px;
  border: 2px solid #0b0c0c;
  border-left: none;
  background-color: #f3f2f1;
  text-align: center;
  white-space: nowrap;
  cursor: default;
  flex: 0 0 auto;
  font-size: 1.1875rem;
  line-height: 1.3157894737;
`;

export const InputWithSuffix = ({
  id,
  name,
  label,
  labelHidden = false,
  value,
  onChange,
  errorMessage,
  hint,
  suffix,
  testId,
}: Props) => {
  return (
    <FormGroup error={errorMessage !== undefined}>
      <Label htmlFor={id}>
        {labelHidden ? (
          <VisuallyHidden>{label}</VisuallyHidden>
        ) : (
          <LabelText>{label}</LabelText>
        )}
      </Label>
      <HintText>{hint}</HintText>
      {errorMessage && <ErrorText>{errorMessage}</ErrorText>}
      <StyledInputWrapper data-testid={testId}>
        <StyledInput id={id} name={name} value={value} onChange={onChange} />
        <StyledSuffix aria-hidden="true">{suffix}</StyledSuffix>
      </StyledInputWrapper>
    </FormGroup>
  );
};
