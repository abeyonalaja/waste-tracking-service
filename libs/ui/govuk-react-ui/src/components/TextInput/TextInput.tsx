interface Props {
  id: string;
  name: string;
  value?: string;
  label?: string;
  hint?: string;
  error?: string;
  testId?: string;
}

export const TextInput = ({
  id,
  name,
  value,
  error,
  testId,
  hint,
}: Props): JSX.Element => {
  return (
    <input
      className={`govuk-input ${error ? 'govuk-input--error' : ''}`}
      id={id}
      name={name}
      type="text"
      value={value}
      data-testid={testId}
      title={hint} // Add title attribute
      placeholder={hint} // Add placeholder attribute
    />
  );
};
