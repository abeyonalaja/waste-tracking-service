import Link from 'next/link';

export interface ListStrings {
  remove: string;
  hidden: string;
}
interface Code {
  code: string;
  description: string;
}

interface ListProps {
  addedCodes: Code[];
  setCodeToRemove: React.Dispatch<React.SetStateAction<string>>;
  strings: ListStrings;
}

export function List({
  addedCodes,
  setCodeToRemove,
  strings,
}: ListProps): React.ReactNode {
  return (
    <dl className="govuk-summary-list">
      {addedCodes.map((code) => {
        return (
          <div className="govuk-summary-list__row" key={code.code}>
            <dt className="govuk-summary-list__key">{code.code}</dt>
            <dd className="govuk-summary-list__value">{code.description}</dd>
            <dd className="govuk-summary-list__actions">
              <Link
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setCodeToRemove(code.code);
                  window.scrollTo(0, 0);
                }}
              >
                {strings.remove}
                <span className="govuk-visually-hidden">
                  {`${strings.hidden} ${code.code}`}
                </span>
              </Link>
            </dd>
          </div>
        );
      })}
    </dl>
  );
}
