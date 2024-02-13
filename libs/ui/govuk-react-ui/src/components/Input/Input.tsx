import { FormGroup } from '../FormGroup';
import { TextInput } from '../TextInput';
import { Label } from '../Label';
import { Hint } from '../Hint';
import { ErrorMessage } from '../ErrorMessage';

type Props = {
  id: string;
  name: string;
  value?: string;
  label?: string;
  hint?: string;
  error?: string;
  testId?: string;
};

export const Input = ({
  id,
  name,
  value,
  label,
  hint,
  error,
  testId,
}: Props) => {
  return (
    <FormGroup error={!!error} testId={testId}>
      {label && <Label text={label} inputId={id} />}
      {hint && <Hint text={hint} />}
      {error && <ErrorMessage text={error} />}
      <TextInput id={id} name={name} value={value} error={error} />
    </FormGroup>
  );
};
