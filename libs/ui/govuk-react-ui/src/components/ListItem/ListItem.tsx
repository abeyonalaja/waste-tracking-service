import { ReactNode } from 'react';

type Props = {
  children?: ReactNode;
  testId?: string;
};

export const ListItem = ({ children, testId }: Props) => {
  return <li data-testid={testId}>{children}</li>;
};
