import styles from './Loading.module.scss';

export function Loading(): JSX.Element {
  return (
    <span className={styles.loading}>
      <span className="govuk-visually-hidden">The page is loading</span>{' '}
    </span>
  );
}
