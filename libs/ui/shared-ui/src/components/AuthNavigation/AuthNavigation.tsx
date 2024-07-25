import styles from './AuthNavigation.module.scss';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { SignInLink } from './SignInLink';
import { SignOutLink } from './SignOutLink';

export async function AuthNavigation(): Promise<JSX.Element> {
  const session = await getServerSession();

  function getProfileUrl(): string {
    if (process.env.DCID_WELLKNOWN && process.env.DCID_WELLKNOWN.length > 10) {
      const domain = new URL(process.env.DCID_WELLKNOWN);
      return domain.origin;
    }
    return '';
  }
  async function getSignOutUrl(): Promise<string> {
    if (process.env.DCID_WELLKNOWN) {
      const response = await fetch(process.env.DCID_WELLKNOWN, {
        cache: 'force-cache',
        method: 'get',
      });
      return await response.json();
    }
    return '';
  }

  if (session) {
    return (
      <nav className={styles.navigation}>
        <ul className={styles.list}>
          <li>
            <Link
              href={getProfileUrl()}
              className="govuk-link govuk-link--inverse"
            >
              {session?.user?.name}
            </Link>
          </li>
          <li>
            <SignOutLink wellKnownObj={await getSignOutUrl()} />
          </li>
        </ul>
      </nav>
    );
  } else {
    return (
      <nav className={styles.navigation}>
        <ul className={styles.list}>
          <li>
            <SignInLink />
          </li>
        </ul>
      </nav>
    );
  }
}
