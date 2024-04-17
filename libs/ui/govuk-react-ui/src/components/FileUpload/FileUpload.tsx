interface FileUploadProps {
  label?: string;
  id: string;
  name: string;
  accept?: string;
  errorLabel: string;
  errorMessage?: string | null;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function FileUpload({
  label,
  id,
  name,
  accept,
  errorLabel,
  errorMessage,
  onChange,
}: FileUploadProps) {
  return (
    <div
      className={
        errorMessage
          ? 'govuk-form-group govuk-form-group--error'
          : 'govuk-form-group'
      }
    >
      {label && (
        <label className="govuk-label" htmlFor={id}>
          {label}
        </label>
      )}
      {errorMessage && (
        <p id="file-upload-1-error" className="govuk-error-message">
          <span className="govuk-visually-hidden">{errorLabel}</span>
          {errorMessage}
        </p>
      )}
      <input
        className="govuk-file-upload"
        id={id}
        name={name}
        type="file"
        onChange={onChange}
        accept={accept && accept}
      />
    </div>
  );
}
