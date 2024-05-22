import { ReactNode } from 'react';
import styles from './ButtonGroup.module.scss';
interface Props {
  children?: ReactNode;
  testId?: string;
}

export const ButtonGroup = ({ children, testId }: Props): JSX.Element => {
  return (
    <div className={styles.govukButtonGroup} data-testid={testId}>
      {children}
    </div>
  );
};
