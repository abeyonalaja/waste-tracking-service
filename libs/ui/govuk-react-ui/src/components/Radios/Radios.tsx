import { FormGroup } from '../FormGroup';
import { Hint } from '../Hint';
import { ErrorMessage } from '../ErrorMessage';

type Props = {
  name: string;
  value?: string;
  label: string;
  options: Array<string>;
  hint?: string;
  error?: string;
  small?: boolean;
  inline?: boolean;
  onchange?: () => void;
  testId?: string;
};

export const Radios = ({
  name,
  value,
  label,
  options,
  hint,
  error,
  small,
  inline,
  onchange = () => {
    return;
  },
  testId,
}: Props) => {
  return (
    <FormGroup error={!!error}>
      <fieldset className="govuk-fieldset">
        <legend className="govuk-fieldset__legend">{label}</legend>
        {hint && <Hint text={hint} />}
        {error && <ErrorMessage text={error} />}
        <div
          data-testid={testId}
          className={`govuk-radios
          ${small ? 'govuk-radios--small' : ''}
          ${inline ? 'govuk-radios--inline' : ''}
          `}
        >
          {options.map((option, index) => {
            const radioId =
              name.replace(' ', '').toLowerCase() + '-radio-' + index + 1;
            return (
              // Maybe not the best key to use here for the map
              <div key={index} className="govuk-radios__item">
                <input
                  className="govuk-radios__input"
                  type="radio"
                  name={name}
                  value={option}
                  id={radioId}
                  checked={value === option}
                  onChange={onchange}
                />
                <label
                  className="govuk-label govuk-radios__label"
                  htmlFor={radioId}
                >
                  {option}
                </label>
              </div>
            );
          })}
        </div>
      </fieldset>
    </FormGroup>
  );
};
