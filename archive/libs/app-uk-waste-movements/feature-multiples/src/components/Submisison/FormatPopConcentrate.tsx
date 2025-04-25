import { UkwmPop } from '@wts/api/waste-tracking-gateway';

interface FormatPopConcentrateProps {
  data: UkwmPop[] | undefined;
}

export function FormatPopConcentrate({
  data,
}: FormatPopConcentrateProps): JSX.Element | null {
  if (data) {
    return (
      <ul className="govuk-list">
        {data.map((pop, index) => {
          return (
            <li key={`pop-concentrate-${index}`}>
              {pop.concentration}
              {pop.concentrationUnit}
            </li>
          );
        })}
      </ul>
    );
  }
  return null;
}
