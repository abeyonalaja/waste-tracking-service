interface SectionBreakProps {
  visible?: boolean;
  size?: 's' | 'm' | 'l' | 'xl';
  testId?: string;
}

export function SectionBreak({
  visible = true,
  size = 's',
  testId,
}: SectionBreakProps): JSX.Element {
  return (
    <hr
      className={`govuk-section-break govuk-section-break--${size} ${
        visible ? 'govuk-section-break--visible' : ''
      }`}
      data-testid={testId}
    />
  );
}
