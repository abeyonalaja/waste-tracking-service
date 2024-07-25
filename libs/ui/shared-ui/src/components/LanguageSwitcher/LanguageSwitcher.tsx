import styles from './LanguageSwitcher.module.scss';
import { getLocale } from 'next-intl/server';
import LanguageSwitcherLink from './LanguageSwitcherLink';

export async function LanguageSwitcher(): Promise<JSX.Element> {
  const locale = await getLocale();
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
