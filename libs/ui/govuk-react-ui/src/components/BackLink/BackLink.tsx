type Props = {
  text?: string;
  testId?: string;
};

export const BackLink = ({ text = 'Back', testId }: Props) => {
  return (
    <a href={`#back`} className={`govuk-back-link`} data-testid={testId}>
      {text}
    </a>
  );
};
