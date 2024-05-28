import { UkwmPop } from '@wts/api/waste-tracking-gateway';

interface FormatPopDetailsProps {
  data: UkwmPop[] | undefined;
}

export function FormatPopDetails({
  data,
}: FormatPopDetailsProps): JSX.Element | null {
  if (data) {
    return (
      <ul className="govuk-list">
        {data.map((pop, index) => {
          return <li key={`pop-item-${index}`}>{pop.name}</li>;
        })}
      </ul>
    );
  }
  return null;
}
