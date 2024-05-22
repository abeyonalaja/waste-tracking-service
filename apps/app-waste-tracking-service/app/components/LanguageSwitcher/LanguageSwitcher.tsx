'use client';

import { usePathname as useNextPathname } from 'next/navigation';
import { usePathname, useRouter, Link } from '../../../navigation';
import styles from './LanguageSwitcher.module.scss';

export function LanguageSwitcher(): JSX.Element {
  const intlPathname = usePathname();
  const router = useRouter();
  const fullPathName = useNextPathname();
  const locale = fullPathName.split('/')[1];

  return (
    <nav aria-label="Language switcher" className={styles.container}>
      <ul className={styles.languageToggle}>
        <li>
          {locale === 'en' ? (
            <span aria-current="true">English</span>
          ) : (
            <Link
              hrefLang="en"
              href="#"
              onClick={(e) => {
                e.preventDefault();
                router.push(intlPathname, { locale: 'en' });
              }}
              className={`govuk-link`}
            >
              <span className="govuk-visually-hidden">
                Use this service in{' '}
              </span>
              English
            </Link>
          )}
        </li>
        <li>
          {locale === 'cy' ? (
            <span aria-current="true">Cymraeg</span>
          ) : (
            <Link
              hrefLang="cy"
              href="#"
              onClick={(e) => {
                e.preventDefault();
                router.push(intlPathname, { locale: 'cy' });
              }}
              className={`govuk-link`}
            >
              <span className="govuk-visually-hidden">
                Use this service in{' '}
              </span>
              Cymraeg
            </Link>
          )}
        </li>
      </ul>
    </nav>
  );
}
