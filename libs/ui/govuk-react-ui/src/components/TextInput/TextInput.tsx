type Props = {
  id: string;
  name: string;
  value?: string;
  label?: string;
  hint?: string;
  error?: string;
  testId?: string;
};

export const TextInput = ({ id, name, value, error, testId }: Props) => {
  return (
    <input
      className={`govuk-input ${error ? 'govuk-input--error' : ''}`}
      id={id}
      name={name}
      type="text"
      value={value}
      data-testid={testId}
    />
  );
};
