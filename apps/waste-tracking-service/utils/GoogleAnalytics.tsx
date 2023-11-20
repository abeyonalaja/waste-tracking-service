import ReactGA from 'react-ga';
import { useCookies } from 'react-cookie';

export const initGA = () => {
  ReactGA.initialize('${process.env.NX_GOOGLE_ANALYTICS_ACCOUNT}');
};

export const logPageView = () => {
  ReactGA.set({ page: window.location.pathname });
  ReactGA.pageview(window.location.pathname);
};

export const useGoogleAnalytics = () => {
  const [cookies] = useCookies(['cookieConsent']);
  const consentCookie = cookies.cookieConsent;
  const isConsentGiven = consentCookie?.analytics === true;
  if (isConsentGiven) {
    initGA();
    logPageView();
  }
  return {
    isConsentGiven,
    initGA,
    logPageView,
  };
};
