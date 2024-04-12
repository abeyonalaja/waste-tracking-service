import { ReactNode } from 'react';
import styles from './GridRow.module.scss';

interface GridRowProps {
  children?: ReactNode;
  display?: 'flex' | 'flex-from-tablet';
  testId?: string;
}

export function GridRow({ children, display, testId }: GridRowProps) {
  let additionalClass;
  if (display === 'flex') additionalClass = styles['grid-row-flex'];
  if (display === 'flex-from-tablet')
    additionalClass = styles['grid-row-flex--from-tablet'];

  return (
    <div
      className={`${styles['grid-row']} ${additionalClass}`}
      data-testid={testId}
    >
      {children}
    </div>
  );
}
