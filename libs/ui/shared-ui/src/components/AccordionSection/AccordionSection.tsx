import styles from './AccordionSection.module.scss';
import { Tag } from '@wts/ui/govuk-react-ui';

interface AccordionSectionProps {
  id: string;
  title: string;
  summary?: string;
  sections: Record<string, boolean>;
  toggle: (id: string) => void;
  showText?: string;
  hideText?: string;
  children: React.ReactNode;
  status?: string;
}

export function AccordionSection({
  id,
  title,
  summary,
  sections,
  toggle,
  showText = 'Show',
  hideText = 'Hide',
  children,
  status,
}: AccordionSectionProps): React.ReactNode {
  const expanded = sections[id];
  return (
    <div
      className={`govuk-accordion__section ${
        expanded && 'govuk-accordion__section--expanded'
      }`}
    >
      <div className="govuk-accordion__section-header">
        <h2 className="govuk-accordion__section-heading">
          <button
            type="button"
            aria-controls={`${id}-content`}
            className="govuk-accordion__section-button"
            aria-expanded={expanded}
            aria-label={title}
            onClick={() => toggle(id)}
          >
            <span
              className={`govuk-accordion__section-heading-text ${styles.sectionHeading}`}
            >
              <span className="govuk-accordion__section-heading-text-focus">
                {title}
              </span>
              {status && <Tag>{status}</Tag>}
            </span>

            {summary && (
              <span
                className="govuk-accordion__section-summary govuk-body"
                id={`${id}-summary`}
              >
                <span className="govuk-accordion__section-summary-focus">
                  {summary}
                </span>
              </span>
            )}

            <span className="govuk-visually-hidden govuk-accordion__section-heading-divider">
              ,
            </span>
            <span className="govuk-accordion__section-toggle">
              <span className="govuk-accordion__section-toggle-focus">
                <span
                  className={`govuk-accordion-nav__chevron ${
                    !expanded && 'govuk-accordion-nav__chevron--down'
                  }`}
                />
                <span className="govuk-accordion__section-toggle-text">
                  {expanded ? hideText : showText}
                </span>
              </span>
            </span>
          </button>
        </h2>
      </div>
      <div id={`${id}-content`} className="govuk-accordion__section-content">
        {children}
      </div>
    </div>
  );
}
