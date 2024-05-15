import { ReactNode } from 'react';
import styles from './ButtonGroup.module.scss';
type Props = {
  children?: ReactNode;
  testId?: string;
};

export const ButtonGroup = ({ children, testId }: Props) => {
  return (
    <div className={styles.govukButtonGroup} data-testid={testId}>
      {children}
    </div>
  );
};
