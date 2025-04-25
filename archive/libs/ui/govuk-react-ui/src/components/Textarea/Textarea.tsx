import { FormGroup } from '../FormGroup';
import { Label } from '../Label';
import { Hint } from '../Hint';
import { ErrorMessage } from '../ErrorMessage';

interface Props {
  id: string;
  name: string;
  value?: string;
  rows?: number;
  label?: string;
  hint?: string;
  error?: string;
  testId?: string;
}

export const Textarea = ({
  id,
  name,
  value,
  rows = 5,
  label,
  hint,
  error,
  testId,
}: Props): JSX.Element => {
  return (
    <FormGroup error={!!error}>
      {label && <Label text={label} inputId={id} />}
      {hint && <Hint text={hint} />}
      {error && <ErrorMessage text={error} />}
      <textarea
        className={`govuk-textarea ${error ? 'govuk-textarea--error' : ''}`}
        id={id}
        name={name}
        rows={rows}
        data-testid={testId}
        title={label}
        placeholder={hint}
      >
        {value}
      </textarea>
    </FormGroup>
  );
};
