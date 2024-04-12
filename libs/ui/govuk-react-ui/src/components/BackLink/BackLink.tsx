type Props = {
  text?: string;
  testId?: string;
  href: string;
};

export const BackLink = ({ text = 'Back', testId, href }: Props) => {
  return (
    <a href={href} className={`govuk-back-link`} data-testid={testId}>
      {text}
    </a>
  );
};
