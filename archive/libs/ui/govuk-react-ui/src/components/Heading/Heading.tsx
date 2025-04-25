interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  size?: 's' | 'm' | 'l' | 'xl';
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  children?: React.ReactNode;
}

export function Heading(props: HeadingProps): React.ReactElement {
  const { size = 'l', level = 1, children, className, ...rest } = props;

  let combinedClassName;
  if (className) {
    combinedClassName = `govuk-heading-${size} ${className}`;
  } else {
    combinedClassName = `govuk-heading-${size}`;
  }

  if (level === 6) {
    return (
      <h6 className={combinedClassName} {...rest}>
        {children}
      </h6>
    );
  }

  if (level === 5) {
    return (
      <h5 className={combinedClassName} {...rest}>
        {children}
      </h5>
    );
  }

  if (level === 4) {
    return (
      <h4 className={combinedClassName} {...rest}>
        {children}
      </h4>
    );
  }

  if (level === 3) {
    return (
      <h3 className={combinedClassName} {...rest}>
        {children}
      </h3>
    );
  }

  if (level === 2) {
    return (
      <h2 className={combinedClassName} {...rest}>
        {children}
      </h2>
    );
  }

  return (
    <h1 className={combinedClassName} {...rest}>
      {children}
    </h1>
  );
}
