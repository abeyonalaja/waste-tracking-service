import { FormGroup } from '../FormGroup';
import { TextInput } from '../TextInput';
import { Label } from '../Label';
import { Hint } from '../Hint';
import { ErrorMessage } from '../ErrorMessage';
import { InputType, InputModeType } from '../../types';

interface Props {
  type?: InputType;
  id: string;
  name: string;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  hint?: string;
  error?: string;
  inputAdditionalClassName?: string;
  inputAutoComplete?: string;
  ariaDescribedBy?: boolean;
  testId?: string;
  inputMode?: InputModeType;
  spellCheck?: boolean;
}

export const Input = ({
  type = 'text',
  id,
  name,
  value,
  onChange,
  label,
  hint,
  error,
  inputAdditionalClassName,
  inputAutoComplete,
  testId,
  ariaDescribedBy,
  inputMode,
  spellCheck,
}: Props): JSX.Element => {
  return (
    <FormGroup error={!!error} testId={testId}>
      {label && <Label text={label} inputId={id} />}
      {hint && <Hint text={hint} id={id} />}
      {error && <ErrorMessage text={error} />}
      <TextInput
        type={type}
        id={id}
        name={name}
        value={value}
        error={error}
        autoComplete={inputAutoComplete}
        additionalClassName={inputAdditionalClassName}
        onChange={onChange}
        ariaDescribedBy={ariaDescribedBy}
        inputMode={inputMode}
        spellCheck={spellCheck}
      />
    </FormGroup>
  );
};
