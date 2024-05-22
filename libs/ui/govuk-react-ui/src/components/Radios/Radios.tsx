import { FormGroup } from '../FormGroup';
import { Hint } from '../Hint';
import { ErrorMessage } from '../ErrorMessage';

interface Option {
  text: string;
  value: string;
}

interface Props {
  name: string;
  value?: string;
  legendText?: string;
  legendSize?: 's' | 'm' | 'l';
  options: Option[];
  hint?: string;
  error?: string;
  small?: boolean;
  inline?: boolean;
  onchange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  testId?: string;
}

export const Radios = ({
  name,
  value,
  legendText,
  legendSize = 'm',
  options,
  hint,
  error,
  small,
  inline,
  onchange = (): void => {},
  testId,
}: Props): JSX.Element => {
  return (
    <FormGroup error={!!error}>
      <fieldset className="govuk-fieldset">
        <legend
          className={`govuk-fieldset__legend govuk-fieldset__legend--${legendSize}`}
        >
          {legendText}
        </legend>
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
              <div key={`radio-option-${index}`} className="govuk-radios__item">
                <input
                  className="govuk-radios__input"
                  type="radio"
                  name={name}
                  value={option.value}
                  id={radioId}
                  checked={value === option.value}
                  onChange={onchange}
                />
                <label
                  className="govuk-label govuk-radios__label"
                  htmlFor={radioId}
                >
                  {option.text}
                </label>
              </div>
            );
          })}
        </div>
      </fieldset>
    </FormGroup>
  );
};
