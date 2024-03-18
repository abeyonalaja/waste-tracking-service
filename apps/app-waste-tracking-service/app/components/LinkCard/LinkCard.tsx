import React from 'react';
import styles from './LinkCard.module.scss';
import { Link } from '../index';

interface Props {
  title?: string;
  content?: string;
  href?: string;
}

export function LinkCard({ title, href = '#', content }: Props) {
  return (
    <Link href={href} className={styles['card']}>
      <>
        <h2 className={`govuk-heading-s ${styles['card-title']}`}>{title}</h2>
        <p>{content}</p>
      </>
    </Link>
  );
}
