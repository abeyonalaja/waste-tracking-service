'use client';

import Link from 'next/link';

import styles from './LanguageSwitch.module.scss';
import { useLocale } from 'next-intl';
import { createSharedPathnamesNavigation } from 'next-intl/navigation';

import { localeNames, locales } from '../../../i18nconfig';
import React from 'react';
const { useRouter, usePathname } = createSharedPathnamesNavigation({ locales });

export function LanguageSwitch() {
  const locale = useLocale();
  const router = useRouter();
  const pathName = usePathname();

  function switchLocale(
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    language: string
  ) {
    e.preventDefault();
    router.push(pathName, { locale: language });
  }

  return (
    <nav aria-label="Language toggle">
      <ul className={styles['language-list']}>
        <li>
          {locale === locales[0] ? (
            <span>{localeNames.en}</span>
          ) : (
            <Link
              className="govuk-link govuk-link--no-underline"
              onClick={(e) => switchLocale(e, locales[0])}
              href="#"
              locale={locales[0]}
            >
              {localeNames.en}
            </Link>
          )}
        </li>
        <li>
          {locale === locales[1] ? (
            <span>{localeNames.cy}</span>
          ) : (
            <Link
              className="govuk-link govuk-link--no-underline"
              onClick={(e) => switchLocale(e, locales[1])}
              href="#"
              locale={locales[1]}
            >
              {localeNames.cy}
            </Link>
          )}
        </li>
      </ul>
    </nav>
  );
}
