import styles from './HeaderNavigation.module.scss';
import { Link } from '../index';
import { getServerSession } from 'next-auth';
import { SignInLink } from './SignInLink';
import { SignOutLink, WellKnownObj } from './SignOutLink';

export async function HeaderNavigation(): Promise<JSX.Element> {
  const session = await getServerSession();
  function getProfileUrl(): string {
    if (process.env.DCID_WELLKNOWN) {
      const domain = new URL(process.env.DCID_WELLKNOWN);
      return domain.origin;
    }
    return '';
  }

  async function getSignOutUrl(): Promise<
    string | { wellKnownObj: WellKnownObj }
  > {
    if (process.env.DCID_WELLKNOWN) {
      const response = await fetch(process.env.DCID_WELLKNOWN, {
        cache: 'force-cache',
        method: 'get',
      });
      return await response.json();
    }
    return '';
  }
  const signOutUrl = await getSignOutUrl();
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
            {typeof signOutUrl === 'object' && 'wellKnownObj' in signOutUrl ? (
              <SignOutLink wellKnownObj={signOutUrl.wellKnownObj} />
            ) : null}
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
