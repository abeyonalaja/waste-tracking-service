import { ReactNode } from 'react';

type Props = {
  type?: 'ordered' | 'unordered';
  children?: ReactNode;
  testId?: string;
};

export const List = ({ type, children, testId }: Props) => {
  const listClassName = () => {
    if (type === 'ordered') return `govuk-list--number`;
    if (type === 'unordered') return `govuk-list--bullet`;
    return null;
  };
  const ListType = (
    type === 'ordered' ? 'ol' : 'ul'
  ) as keyof JSX.IntrinsicElements;
  return (
    <ListType className={`govuk-list ${listClassName()}`} data-testid={testId}>
      {children}
    </ListType>
  );
};
