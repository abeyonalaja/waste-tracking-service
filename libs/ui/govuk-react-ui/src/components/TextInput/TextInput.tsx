import { InputType, InputModeType } from '../../types';

interface Props {
  type: InputType;
  id: string;
  name: string;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  autoComplete?: string;
  additionalClassName?: string;
  ariaDescribedBy?: boolean;
  inputMode?: InputModeType;
  testId?: string;
  spellCheck?: boolean;
}

export const TextInput = ({
  type = 'text',
  id,
  name,
  value,
  onChange,
  error,
  autoComplete,
  additionalClassName,
  ariaDescribedBy,
  inputMode,
  testId,
  spellCheck,
}: Props): JSX.Element => {
  return (
    <input
      className={`govuk-input ${additionalClassName ? additionalClassName : ''} ${error ? 'govuk-input--error' : ''}`}
      id={id}
      name={name}
      type={type}
      value={value}
      autoComplete={autoComplete}
      aria-describedby={ariaDescribedBy ? `${id}-hint` : undefined}
      onChange={onChange}
      data-testid={testId}
      inputMode={inputMode ? inputMode : undefined}
      spellCheck={spellCheck}
    />
  );
};
