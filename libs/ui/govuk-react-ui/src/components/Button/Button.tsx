import { ReactNode } from 'react';

type Props = {
  children?: ReactNode;
  secondary?: boolean;
  start?: boolean;
  text?: string;
  testId?: string;
};

export const Button = ({ children, secondary, start, text, testId }: Props) => {
  return (
    <button
      className={`govuk-button ${secondary && `govuk-button--secondary`} ${
        start && `govuk-button--start`
      }`}
      data-testid={testId}
    >
      {text || children}
      {start && (
        <svg
          className="govuk-button__start-icon"
          xmlns="http://www.w3.org/2000/svg"
          width="17.5"
          height="19"
          viewBox="0 0 33 40"
          aria-hidden="true"
          focusable="false"
        >
          <path fill="currentColor" d="M0 0h13l20 20-20 20H0l20-20z" />
        </svg>
      )}
    </button>
  );
};
