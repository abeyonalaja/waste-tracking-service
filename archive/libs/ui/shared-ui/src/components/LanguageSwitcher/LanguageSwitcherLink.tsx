'use client';
import { setUserLocale } from './setUserLocale';

export default function LanguageSwitcherLink({
  locale,
  children,
}: {
  locale: string;
  children: React.ReactNode;
}): JSX.Element {
  function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
    setUserLocale(locale);
  }

  return (
    <a
      href="#"
      hrefLang={locale}
      className="govuk-link govuk-link--no-visited-state"
      onClick={handleClick}
    >
      <span className="govuk-visually-hidden">Use this service in </span>
      {children}
    </a>
  );
}
