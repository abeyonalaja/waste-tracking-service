import { UkwmChemicalAndBiologicalComponent } from '@wts/api/waste-tracking-gateway';

interface FormatChemicalAndBiologicalComponentsProps {
  data: UkwmChemicalAndBiologicalComponent[] | undefined;
}

export function FormatChemicalAndBiologicalComponents({
  data,
}: FormatChemicalAndBiologicalComponentsProps): JSX.Element {
  if (data) {
    return (
      <ul className="govuk-list">
        {data.map((component, index) => {
          return (
            <li key={`haz-item-${index}`}>
              {component.concentration}
              {component.concentrationUnit} {component.name}
            </li>
          );
        })}
      </ul>
    );
  }
  return <>Not provided</>;
}
