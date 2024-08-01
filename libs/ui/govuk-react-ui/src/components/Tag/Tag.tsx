import { ReactNode } from 'react';
import styles from './Tag.module.scss';

export interface TagColour {
  colour:
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
}

interface Props {
  children?: ReactNode;
  classes?: string;
  colour?: TagColour;
  testId?: string;
  id?: string;
  noWrap?: boolean;
}

export const Tag = ({
  children,
  classes,
  colour,
  testId,
  id,
  noWrap = false,
}: Props): JSX.Element => {
  return (
    <strong
      className={`govuk-tag ${colour && `govuk-tag--${colour}`} ${classes} ${noWrap && styles.noWrap}`}
      data-testid={testId}
      id={id && id}
    >
      {children}
    </strong>
  );
};
