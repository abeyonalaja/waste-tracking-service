import { ReactNode } from 'react';

type Props = {
  children?: ReactNode;
  classes?: string;
  colour?:
    | 'grey'
    | 'green'
    | 'turquoise'
    | 'blue'
    | 'light-blue'
    | 'purple'
    | 'pink'
    | 'red'
    | 'orange'
    | 'yellow';
  testId?: string;
};

export const Tag = ({ children, classes, colour, testId }: Props) => {
  return (
    <strong
      className={`govuk-tag ${colour && `govuk-tag--${colour}`} ${classes}`}
      data-testid={testId}
    >
      {children}
    </strong>
  );
};
