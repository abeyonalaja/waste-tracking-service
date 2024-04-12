interface FileUploadProps {
  label?: string;
  id: string;
  name: string;
  accept?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function FileUpload({
  label,
  id,
  name,
  onChange,
  accept,
}: FileUploadProps) {
  return (
    <div className="govuk-form-group">
      {label && (
        <label className="govuk-label" htmlFor={id}>
          {label}
        </label>
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
