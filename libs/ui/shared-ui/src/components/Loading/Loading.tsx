import styles from './Loading.module.scss';

interface LoadingProps {
  centered?: boolean;
}

export function Loading({ centered }: LoadingProps): JSX.Element {
  if (centered) {
    return (
      <div className={styles.centered}>
        <span className={styles.loading}>
          <span className="govuk-visually-hidden">The page is loading</span>{' '}
        </span>
      </div>
    );
  }
  return (
    <span className={styles.loading}>
      <span className="govuk-visually-hidden">The page is loading</span>{' '}
    </span>
  );
}
