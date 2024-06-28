import { ReactNode } from 'react';

interface Props {
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
  id?: string;
}

export const Tag = ({
  children,
  classes,
  colour,
  testId,
  id,
}: Props): JSX.Element => {
  return (
    <strong
      className={`govuk-tag ${colour && `govuk-tag--${colour}`} ${classes}`}
      data-testid={testId}
      id={id && id}
    >
      {children}
    </strong>
  );
};
