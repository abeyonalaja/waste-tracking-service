# UK Waste Movements

---

## Frontend styleguide

### Importing components from the GDS react lib

When importing any component from the GDS react library, import them all at once and assign the `GovUK` alias. This namespaces the components, and easily allows you to see where your components come from. Tree shaking will only include used components

Importing
`import * as GovUK from '@wts/ui/govuk-react-ui';`

Usage
`<GovUK.Caption size={'l'}>Caption text</GovUK.Caption>`

### Declaring components

- Use function keyword instead of arrow functions.
- Export the component using a named export (no default keyword)
- Use `interface` instead of `type`
- Name the component props interface using `COMPONENT_NAMEProps`

Example

```
interface InputProps {
  id: string;
  name: string;
  value?: string;
  label?: string;
  hint?: string;
  error?: string;
  testId?: string;
}

export function Input({
  id,
  name,
  value,
  label,
  hint,
  error,
  testId,
}: InputProps) {
  return (
    <FormGroup error={!!error} testId={testId}>
      {label && <Label text={label} inputId={id} />}
      {hint && <Hint text={hint} />}
      {error && <ErrorMessage text={error} />}
      <TextInput id={id} name={name} value={value} error={error} />
    </FormGroup>
  );
}
```
