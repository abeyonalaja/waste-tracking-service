import { FormGroup } from '../FormGroup';
import { TextInput } from '../TextInput';
import { Label } from '../Label';
import { Hint } from '../Hint';
import { ErrorMessage } from '../ErrorMessage';

interface Props {
  id: string;
  name: string;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  hint?: string;
  error?: string;
  inputAdditionalClassName?: string;
  inputAutoComplete?: string;
  testId?: string;
}

export const Input = ({
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
}: Props): JSX.Element => {
  return (
    <FormGroup error={!!error} testId={testId}>
      {label && <Label text={label} inputId={id} />}
      {hint && <Hint text={hint} />}
      {error && <ErrorMessage text={error} />}
      <TextInput
        id={id}
        name={name}
        value={value}
        error={error}
        autoComplete={inputAutoComplete}
        additionalClassName={inputAdditionalClassName}
        onChange={onChange}
      />
    </FormGroup>
  );
};
