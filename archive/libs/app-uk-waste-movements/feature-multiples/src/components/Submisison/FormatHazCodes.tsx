import { UkwmHazardousWasteCode } from '@wts/api/waste-tracking-gateway';

interface FormatHazCodesProps {
  data: UkwmHazardousWasteCode[] | undefined;
}

export function FormatHazCodes({
  data,
}: FormatHazCodesProps): JSX.Element | null {
  if (data) {
    return (
      <ul className="govuk-list">
        {data.map((component, index) => {
          return (
            <li key={`haz-code-${index}`}>
              {component.code}: {component.name}
            </li>
          );
        })}
      </ul>
    );
  }
  return null;
}
