import { ReactNode } from 'react';

interface Props {
  children?: ReactNode;
  testId?: string;
}

export const ListItem = ({ children, testId }: Props): JSX.Element => {
  return <li data-testid={testId}>{children}</li>;
};
