import styles from './HeaderNavigation.module.scss';
import { Link } from '../index';
import { getServerSession } from 'next-auth';
import { SignInLink } from './SignInLink';
import { SignOutLink } from './SignOutLink';

export async function HeaderNavigation() {
  const session = await getServerSession();
  function getProfileUrl() {
    if (process.env.DCID_WELLKNOWN) {
      const domain = new URL(process.env.DCID_WELLKNOWN);
      return domain.origin;
    }
    return '';
  }

  async function getSignOutUrl() {
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
  } else if (process.env.NEXT_PUBLIC_UKWM_ENABLED !== 'false') {
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
