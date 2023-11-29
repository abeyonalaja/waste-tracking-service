import { useEffect } from 'react';
import { useCookies } from 'react-cookie';

export const useGoogleTagManager = () => {
  const [cookies] = useCookies(['cookieConsent']);
  const consentCookie = cookies.cookieConsent;
  const isConsentGiven = consentCookie?.analytics === true;

  useEffect(() => {
    if (isConsentGiven) {
      loadGTM();
      gtmScript();
    }
  }, [isConsentGiven]);

  const loadGTM = () => {
    const script = document.createElement('script');
    script.src = `https://www.googletagmanager.com/gtm.js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ACCOUNT}`;
    script.async = true;
    document.head.appendChild(script);
  };

  const gtmScript = () => {
    const script2 = document.createElement('script');
    script2.innerHTML = `  window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ACCOUNT}');`;
    document.head.appendChild(script2);
  };

  return isConsentGiven;
};
