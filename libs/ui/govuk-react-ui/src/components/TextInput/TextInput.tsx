interface Props {
  id: string;
  name: string;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  error?: string;
  autoComplete?: string;
  additionalClassName?: string;
  testId?: string;
}

export const TextInput = ({
  id,
  name,
  value,
  onChange,
  error,
  autoComplete,
  additionalClassName,
  testId,
}: Props): JSX.Element => {
  return (
    <input
      className={`govuk-input ${additionalClassName ? additionalClassName : ''} ${error ? 'govuk-input--error' : ''}`}
      id={id}
      name={name}
      type="text"
      value={value}
      autoComplete={autoComplete}
      onChange={onChange}
      data-testid={testId}
    />
  );
};
