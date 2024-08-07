'use client';
import styles from './LanguageSwitcher.module.scss';
import LanguageSwitcherLink from './LanguageSwitcherLink';
import { useLocale } from 'next-intl';

export function LanguageSwitcher(): JSX.Element {
  const locale: string = useLocale();
  return (
    <nav aria-label="Language switcher" className={styles.container}>
      <ul className={styles.languageToggle}>
        <li>
          {locale === 'en' ? (
            <span aria-current="true">English</span>
          ) : (
            <LanguageSwitcherLink locale={'en'}>English</LanguageSwitcherLink>
          )}
        </li>
        <li>
          {locale === 'cy' ? (
            <span aria-current="true">Cymraeg</span>
          ) : (
            <LanguageSwitcherLink locale={'cy'}>Cymraeg</LanguageSwitcherLink>
          )}
        </li>
      </ul>
    </nav>
  );
}
