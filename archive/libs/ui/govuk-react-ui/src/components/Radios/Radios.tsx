import { FormGroup } from '../FormGroup';
import { Hint } from '../Hint';
import { ErrorMessage } from '../ErrorMessage';

export interface Option {
  text: string;
  value: string;
}

interface Props {
  name: string;
  value?: string;
  legendText?: string | React.ReactNode;
  legendSize?: 's' | 'm' | 'l' | null;
  legendHidden?: boolean;
  options: Option[];
  hint?: string;
  error?: string;
  small?: boolean;
  inline?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  testId?: string;
  ariaLabelledBy?: string;
}

export const Radios = ({
  name,
  value,
  legendText,
  legendSize,
  legendHidden = false,
  options,
  hint,
  error,
  small,
  inline,
  onChange,
  testId,
  ariaLabelledBy,
}: Props): JSX.Element => {
  return (
    <FormGroup error={!!error}>
      <fieldset
        className="govuk-fieldset"
        aria-labelledby={ariaLabelledBy ? ariaLabelledBy : undefined}
      >
        {legendText && (
          <legend
            className={`govuk-fieldset__legend ${legendSize ? `govuk-fieldset__legend--${legendSize}` : ''} ${
              legendHidden ? `govuk-visually-hidden` : ''
            }`}
          >
            {legendText}
          </legend>
        )}

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
            const radioId = `${name.replace(' ', '').toLowerCase()}-radio-${index + 1}`;
            return (
              <div key={`radio-option-${index}`} className="govuk-radios__item">
                <input
                  className="govuk-radios__input"
                  type="radio"
                  name={name}
                  value={option.value}
                  id={radioId}
                  onChange={onChange}
                  checked={option.value === value}
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
